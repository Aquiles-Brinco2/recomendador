/// Connection ///

const clientId = '77493a2e51314634945ab7d1e62a933a';
const clientSecret = '4669ccccfcc04c55a5e50adfd547d1e7';

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}

/// App ///

async function searchSong(query) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    return data.tracks.items; 
}
async function getRecommendations(trackId) {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    return data.tracks; 
}


async function showSongInfo(songId, songName, artistName, albumName, releaseDate, albumImage) {
    const recommendations = await getRecommendations(songId);
    
    document.getElementById('song-info').innerHTML = `
    <h3>Información de la Canción</h3>
    <img src="${albumImage}" alt="${albumName}">
    <p><strong>Canción:</strong> ${songName}</p>
    <p><strong>Artista:</strong> ${artistName}</p>
    <p><strong>Álbum:</strong> ${albumName}</p>
    <p><strong>Año de lanzamiento:</strong> ${releaseDate.split('-')[0]}</p>`;
    
    let html = '<h3>Recomendaciones:</h3><ul>';
    recommendations.forEach(track => {
        html += `<li>
                    <img src="${track.album.images[0].url}" alt="${track.album.name}">
                    <p>${track.name} - ${track.artists[0].name}</p>
                 </li>`;
    });
    html += '</ul>';

    document.getElementById('recommendations').innerHTML = html;
}

async function getSongResults() {
    const query = document.getElementById('songInput').value;
    const songs = await searchSong(query);

    let html = '<h3>Resultados:</h3><ul>';
    songs.forEach(song => {
        html += `<li onclick="showSongInfo('${song.id}', '${song.name}', '${song.artists[0].name}', '${song.album.name}', '${song.album.release_date}', '${song.album.images[0].url}')">
                    <img src="${song.album.images[0].url}" alt="${song.album.name}">
                    ${song.name} - ${song.artists[0].name}
                 </li>`;
    });
    html += '</ul>';

    document.getElementById('results').innerHTML = html;
}
