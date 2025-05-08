

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket, ObjectId } = require('mongodb');
const shortid = require('shortid');
require('dotenv').config();  // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection using MongoDB Atlas URI from .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Initialize GridFS
let gfs;

const conn = mongoose.connection;
conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, {
        bucketName: 'uploads' // Specify your bucket name here
    });
});

// Create storage engine using GridFS
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,  // Use the connection string from .env
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads' // Bucket name in MongoDB
        };
    }
});

// Set up multer to handle file uploads
const upload = multer({ storage });

// Route to handle file uploads
app.post('/api/upload', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('Uploaded file:', req.file);
    res.json({ fileId: req.file.id });
});

// Playlist Model
const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    playlistCode: {
        type: String,
        required: true,
        unique: true,
        default: () => shortid.generate()
    }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

// Song Model
const Song = mongoose.model('Song', new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    songcode: { type: String, required: true, unique: true },
    album: String,
    duration: { type: Number, required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }
}));

// Routes
app.get('/api/playlists', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songs');
        res.json(playlists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/songs/:songId/audio', async (req, res) => {
    try {
        const songId = req.params.songId;

        // Ensure the songId is a valid ObjectId
        if (!ObjectId.isValid(songId)) {
            return res.status(404).json({ error: 'Invalid song ID' });
        }

        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        res.set('Content-Type', 'audio/wav');
        const downloadStream = gfs.openDownloadStream(song.fileId);
        downloadStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/playlists', async (req, res) => {
    try {
        const { name, songs } = req.body;

        const existingSongs = await Song.find({ title: { $in: songs } });
        const songIds = existingSongs.map(song => song._id);

        if (existingSongs.length !== songs.length) {
            const missingSongs = songs.filter(song => !existingSongs.find(existingSong => existingSong.title === song));
            return res.status(400).json({ error: `One or more songs not found: ${missingSongs.join(', ')}` });
        }

        const playlist = new Playlist({ name, songs: songIds });
        await playlist.save();

        res.json(playlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/playlists/:playlistId/collaborators', async (req, res) => {
    try {
        const { userId } = req.body;
        const playlist = await Playlist.findByIdAndUpdate(
            req.params.playlistId,
            { $addToSet: { collaborators: userId } },
            { new: true }
        );
        res.json(playlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
