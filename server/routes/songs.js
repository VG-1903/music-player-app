

const express = require('express');
const Song = require('../models/Song');
const router = express.Router();

// Get all songs with populated playlist information
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().populate('playlist'); // Populating the playlist field
    if (songs.length === 0) {
      return res.status(404).json({ message: 'No songs found' });
    }
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ message: 'Server error while fetching songs' });
  }
});

// Get a specific song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('playlist');
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    console.error('Error fetching song:', err);
    res.status(500).json({ message: 'Server error while fetching the song' });
  }
});

// Create a new song
router.post('/', async (req, res) => {
  const { title, artist, songcode, album, duration, playlist } = req.body;

  // Create a new song document
  const newSong = new Song({
    title,
    artist,
    songcode,
    album,
    duration,
    playlist
  });

  try {
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (err) {
    console.error('Error creating song:', err);
    res.status(400).json({ message: 'Error creating song' });
  }
});

// Update a song by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('playlist');
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(updatedSong);
  } catch (err) {
    console.error('Error updating song:', err);
    res.status(400).json({ message: 'Error updating song' });
  }
});

// Delete a song by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    console.error('Error deleting song:', err);
    res.status(500).json({ message: 'Error deleting song' });
  }
});

module.exports = router;
