


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SongList.css';

function Songs() {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/songs')
            .then(response => setSongs(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="song-container">
            <h2 className="song-title">Songs</h2>
            <ul>
                {songs.map(song => (
                    <li key={song._id} className="song-item">
                        {song.title} - {song.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Songs;
