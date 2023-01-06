const client_id = 'd1dc971326294b8888c95d5a3836b42c';
const redirect_uri = 'https://kesnire.github.io/Jammming/';

let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken){
            console.log("Access Token: " + accessToken);
            return accessToken;
        }

        //check for access token match

        let query = window.location.href;
        const accessTokenMatch = query.match(/access_token=([^&]*)/);
        const expiresInMatch = query.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else{
            window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`
        }
    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}})
        .then(response => {
            return response.json();
        })
        .then(jsonResponse => {
            if (!jsonResponse.tracks){
                return []
            }
            console.log(jsonResponse)
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        });
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;
        let playlistId;

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
        .then(response => {
            return response.json();
        })
        .then(responseJson => {
            userId = responseJson.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {headers: headers, method: 'POST', body: JSON.stringify({name: name})})
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                playlistId = responseJson.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {method: 'POST', headers: headers, body: JSON.stringify({uris: trackUris})});
            })
        })
    }
};

export default Spotify;