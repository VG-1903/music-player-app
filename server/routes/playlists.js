


const express = require('express');
const Playlist = require('../models/Playlist');
const router = express.Router();

// Get all playlists
router.get('/', async (req, res) => {
  try {
    // Find all playlists and populate songs information if needed
    const playlists = await Playlist.find().populate('songs');
    
    if (playlists.length === 0) {
      return res.status(404).json({ message: 'No playlists found' });
    }
    
    res.json(playlists);
  } catch (err) {
    // Catch any errors during the process and send an error message
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Server error while fetching playlists' });
  }
});

// Route to get a specific playlist by ID
router.get('/:id', async (req, res) => {
  try {
    // Fetch playlist by ID and populate the songs
    const playlist = await Playlist.findById(req.params.id).populate('songs');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (err) {
    console.error('Error fetching playlist:', err);
    res.status(500).json({ message: 'Server error while fetching the playlist' });
  }
});

// Route to create a new playlist
router.post('/', async (req, res) => {
  const { name, songs } = req.body;

  // Create a new playlist
  const newPlaylist = new Playlist({
    name,
    songs
  });

  try {
    const savedPlaylist = await newPlaylist.save();
    res.status(201).json(savedPlaylist);
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(400).json({ message: 'Error creating playlist' });
  }
});

// Route to update a playlist
router.put('/:id', async (req, res) => {
  try {
    // Find and update the playlist by ID
    const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(updatedPlaylist);
  } catch (err) {
    console.error('Error updating playlist:', err);
    res.status(400).json({ message: 'Error updating playlist' });
  }
});

// Route to delete a playlist
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);

    if (!deletedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (err) {
    console.error('Error deleting playlist:', err);
    res.status(500).json({ message: 'Error deleting playlist' });
  }
});

module.exports = router;
