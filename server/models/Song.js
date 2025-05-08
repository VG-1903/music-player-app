


const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Song title
    artist: { type: String, required: true },  // Song artist
    songcode: { type: String, required: true, unique: true },  // Unique song code
    album: { type: String },  // Album name (optional)
    duration: { type: Number, required: true },  // Song duration in seconds (required)
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }  // GridFS reference for the song file
});

// Create the Song model based on the schema
const Song = mongoose.model('Song', SongSchema);

// Export the Song model to use it in other parts of the app
module.exports = Song;
