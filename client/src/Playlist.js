


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaylistList.css'; // Make sure to add custom styles here

function PlaylistList() {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/playlists')
            .then(response => {
                setPlaylists(response.data);
            })
            .catch(error => {
                console.error('Error fetching playlists:', error);
            });
    }, []);

    return (
        <div className="playlist-container">
            <h2 className="playlist-title">Playlists</h2>
            <ul className="playlist-list">
                {playlists.length > 0 ? (
                    playlists.map(playlist => (
                        <li key={playlist._id} className="playlist-item">
                            {playlist.name}
                        </li>
                    ))
                ) : (
                    <li className="no-playlists">No playlists available</li>
                )}
            </ul>
        </div>
    );
}

export default PlaylistList;
