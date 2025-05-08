

const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const router = express.Router();

// MongoDB Atlas URL (use your own Atlas URL here)
const mongoURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/musicdatabase?retryWrites=true&w=majority';

// Setup GridFS storage
const storage = new GridFsStorage({
    url: mongoURI,  // MongoDB Atlas URL
    file: (req, file) => {
        return {
            filename: file.originalname,  // Original file name
            bucketName: 'uploads'         // GridFS bucket name
        };
    }
});

const upload = multer({ storage });

// Handle file upload
router.post('/api/upload', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ fileId: req.file.id, filename: req.file.filename });
});

// To retrieve the uploaded file
router.get('/api/files/:filename', (req, res) => {
    const { filename } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    bucket.openDownloadStreamByName(filename)
        .on('data', (chunk) => {
            res.write(chunk);
        })
        .on('end', () => {
            res.end();
        })
        .on('error', (err) => {
            res.status(404).json({ error: 'File not found' });
        });
});

// Error handling for file uploads
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific error
        res.status(500).json({ error: err.message });
    } else {
        // General server error
        res.status(500).json({ error: 'Server error occurred' });
    }
});

module.exports = router;
