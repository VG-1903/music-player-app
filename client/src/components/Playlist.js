import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaylistList.css';

function PlaylistList() {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/playlists')
            .then(response => setPlaylists(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="playlist-container">
            <h2 className="playlist-title">Playlists</h2>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist._id} className="playlist-item">
                        {playlist.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlaylistList;
