const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    playlistCode: {
        type: String,
        required: true,
        unique: true,
        default: () => require('shortid').generate()
    }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;
