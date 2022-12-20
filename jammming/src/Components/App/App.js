
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import React from 'react';
import Spotify from "../../util/Spotify.js";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [
        {name: "Living On A Prayer", artist: "Bon Jovi", album: "Unknown", id: 0},
        {name: "Song 2", artist: "Artist 2", album: "Unknown", id: 1},
        {name: "Song 3", artist: "Artist 3", album: "Unknown", id: 2},
    ],
    playlistName: "My Playlist",
    playlistTracks: [{name: "Song 4", artist: "Artist 4", album: "Unknown", id: 3},
    {name: "Song 5", artist: "Artist 5", album: "Unknown", id: 4},
    {name: "Song 6", artist: "Artist 6", album: "Unknown", id: 5},]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack = (track) =>{
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    let newTracks = [...this.state.playlistTracks, track];
    this.setState({playlistTracks: newTracks});
  }

  removeTrack = (track) => {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
      let newTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
      this.setState({playlistTracks: newTracks});
    }
  }

  updatePlaylistName = (name) => {
    console.log(this.state.playlistName);
  }

  savePlaylist = () =>{
    let trackURIs = this.state.playlistTracks;

  }

  search = (term) => {
    Spotify.search(term)
    .then(results => {
      this.setState({searchResults: results});
    });
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
