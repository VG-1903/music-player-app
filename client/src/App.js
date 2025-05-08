



import React from 'react';
import PlaylistList from './components/Playlist';  // Ensure correct import path
import SongList from './components/Songs';        // Ensure correct import path
import './App.css';                              // Import the CSS for styling

function App() {
    return (
        <div className="container">
            <h1>Music Playlist App</h1>
            <PlaylistList />
            <SongList />
        </div>
    );
}

console.log('App loaded'); // Inside the main component for debugging purposes

export default App;
