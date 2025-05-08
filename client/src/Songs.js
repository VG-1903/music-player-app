import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SongList() {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/songs')
            .then(response => {
                setSongs(response.data);
            })
            .catch(error => {
                console.error('Error fetching songs:', error);
            });
    }, []);

    return (
        <div>
            <h2>Songs</h2>
            <ul>
                {songs.map(song => (
                    <li key={song._id}>{song.title} - {song.artist}</li>
                ))}
            </ul>
        </div>
    );
}

export default SongList;
