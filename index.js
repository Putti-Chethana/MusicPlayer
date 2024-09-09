let currentlyPlayingAudio = null;

const getTracks = async (query) => {
    try {
        const response = await fetch(`https://v1.nocodeapi.com/deekshu_456/spotify/PHUhLWBmIIWffyxH/search?q=${encodeURIComponent(query)}&type=track`);
        const data = await response.json();
        console.log(data);  // Log response for debugging
        return data.tracks.items;
    } catch (error) {
        console.error("Error fetching tracks:", error);
        return [];
    }
};

const displayAlbums = async () => {
    // Fetch tracks and initialize the albums array
    const dakuTracks = await getTracks("Daku");
    const cruelSummerTracks = await getTracks("Cruel Summer");
    
    // Example structure for the albums array
    const albums = [
        { name: "Daku", tracks: dakuTracks },
        { name: "Cruel Summer", tracks: cruelSummerTracks }
    ];
    
    const albumContainer = document.getElementById('album-container');
    const trackContainer = document.getElementById('track-container');

    if (!albumContainer) {
        console.error('Element with id "album-container" not found');
        return;
    }

    albumContainer.innerHTML = '';  // Clear previous content

    albums.forEach(albumData => {
        if (albumData.tracks.length > 0) {
            const album = albumData.tracks[0].album;
            const albumElement = document.createElement('div');
            albumElement.className = 'album';
            albumElement.onclick = () => {
                displayTrackImagesAndNames(albumData.tracks);
                addBackButton();
            };

            const imgElement = document.createElement('img');
            imgElement.src = album.images[0].url;
            imgElement.alt = album.name;

            const nameElement = document.createElement('p');
            nameElement.textContent = album.name;

            albumElement.appendChild(imgElement);
            albumElement.appendChild(nameElement);

            albumContainer.appendChild(albumElement);
        }
    });
};

const displayTrackImagesAndNames = (tracks) => {
    const albumContainer = document.getElementById('album-container');
    const trackContainer = document.getElementById('track-container');

    albumContainer.style.display = 'none';
    trackContainer.style.display = 'flex';
    trackContainer.innerHTML = '';

    tracks.forEach(track => {
        if (track.preview_url) { // Check if preview URL is available
            const trackElement = document.createElement('div');
            trackElement.className = 'track';

            const imgElement = document.createElement('img');
            imgElement.src = track.album.images[0].url;
            imgElement.alt = track.album.name;

            const nameElement = document.createElement('p');
            nameElement.textContent = track.name;

            const audioElement = document.createElement('audio');
            audioElement.controls = true;
            audioElement.src = track.preview_url;

            audioElement.addEventListener('play', () => {
                if (currentlyPlayingAudio && currentlyPlayingAudio !== audioElement) {
                    currentlyPlayingAudio.pause();
                }
                currentlyPlayingAudio = audioElement;
            });

            trackElement.appendChild(audioElement);
            trackElement.appendChild(imgElement);
            trackElement.appendChild(nameElement);

            trackContainer.appendChild(trackElement);
        }
    });
};

const addToRecentlyPlayed = (track) => {
    // Check if the track is already in the recently played list
    if (!recentlyPlayedSongs.find(song => song.id === track.id)) {
        recentlyPlayedSongs.unshift(track); // Add to the beginning of the array

        // Limit the number of recently played songs to 10
        if (recentlyPlayedSongs.length > 10) {
            recentlyPlayedSongs.pop();
        }

        displayRecentlyPlayed();
    }
};

const displayRecentlyPlayed = () => {
    const recentlyPlayedContainer = document.getElementById('recently-played');
    recentlyPlayedContainer.innerHTML = '';

    recentlyPlayedSongs.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.className = 'track';

        const imgElement = document.createElement('img');
        imgElement.src = track.album.images[0].url;
        imgElement.alt = track.album.name;

        const nameElement = document.createElement('p');
        nameElement.textContent = track.name;

        trackElement.appendChild(imgElement);
        trackElement.appendChild(nameElement);

        recentlyPlayedContainer.appendChild(trackElement);
    });
};

const addBackButton = () => {
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.className = 'back-button';
    backButton.onclick = goBackToAlbums;
    const trackContainer = document.getElementById('track-container');
    trackContainer.insertBefore(backButton, trackContainer.firstChild);
};

const goBackToAlbums = () => {
    const albumContainer = document.getElementById('album-container');
    const trackContainer = document.getElementById('track-container');

    albumContainer.style.display = 'flex';
    trackContainer.style.display = 'none';
};

const searchTracks = async () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        const tracks = await getTracks(query);
        displayTrackImagesAndNames(tracks);
        addBackButton();
    }
};

document.getElementById('search-button').addEventListener('click', searchTracks);

document.addEventListener('DOMContentLoaded', displayAlbums);
