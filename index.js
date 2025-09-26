// ------------------- Global Variables -------------------
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filterInput = document.getElementById("filterInput");
const resultsContainer = document.getElementById("resultsContainer");
const playlistInput = document.getElementById("playlistInput");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const audioPlayer = document.getElementById("audioPlayer");

const API_URL = "http://localhost:3000/songs"; // JSON Server endpoint
let allSongs = [];
let playlist = [];

// ------------------- Fetch Songs -------------------
async function fetchSongs(query = "") {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Save all songs
    allSongs = data;

    // If query given, filter
    let songsToShow = query
      ? allSongs.filter(
          (song) =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        )
      : allSongs;

    renderResults(songsToShow);
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

// ------------------- Render Results -------------------
function renderResults(songs) {
  resultsContainer.innerHTML = "";

  if (songs.length === 0) {
    resultsContainer.innerHTML =
      "<p class='text-gray-600'>No songs found. Try another search.</p>";
    return;
  }

  songs.forEach((song) => {
    const card = document.createElement("div");

    card.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <button class="playBtn">▶ Play</button>
      <button class="addBtn">➕ Add</button>
    `;

    // Play button
    card.querySelector(".playBtn").addEventListener("click", () => {
      playSong(song.preview);
    });

    // Add button
    card.querySelector(".addBtn").addEventListener("click", () => {
      addToPlaylist(song);
    });

    resultsContainer.appendChild(card);
  });
}

// ------------------- Play Song -------------------
function playSong(previewUrl) {
  audioPlayer.src = previewUrl;
  audioPlayer.play();
}

// ------------------- Playlist -------------------
function addToPlaylist(song) {
  if (!playlist.find((s) => s.id === song.id)) {
    playlist.push(song);
    renderPlaylist();
  }
}

function renderPlaylist() {
  playlistInput.value = playlist
    .map((s) => `${s.title} - ${s.artist}`)
    .join(", ");
}

// ------------------- Filter -------------------
filterInput.addEventListener("input", (e) => {
  const filterValue = e.target.value.toLowerCase();
  const filtered = allSongs.filter((song) =>
    song.artist.toLowerCase().includes(filterValue)
  );
  renderResults(filtered);
});

// ------------------- Search -------------------
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  fetchSongs(query);
});

// ------------------- Theme Toggle -------------------
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// ------------------- Initial Load -------------------
fetchSongs();
