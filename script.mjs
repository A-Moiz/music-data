// Imports
import { countUsers } from "./common.mjs";
import { getUserIDs, getListenEvents, getSong } from "./data.mjs";
import {
  mostListenedSongID,
  mostListenedSongTime,
  getMostListenedArtist,
  getMostListenedArtistTime,
  getMostListenedOnFriday,
  getMostListenedOnFridayTime,
  highestStreakSongID,
  getTopGenres,
} from "./logic.mjs";

// Get elements from HTML
const userSelect = document.getElementById("user-select");
const tableHeaderUser = document.getElementById("table-header-user");

const mostListenedCount = document.getElementById("most-listened-count");
const mostListenedTime = document.getElementById("most-listened-time");
const mostListenedArtist = document.getElementById(
  "most-listened-artist-count",
);
const mostListenedArtistTime = document.getElementById(
  "most-listened-artist-time",
);
const mostListenedFriday = document.getElementById("friday-song-count");
const mostListenedFridayTime = document.getElementById("friday-song-time");
const longestStreakSongField = document.getElementById("longest-streak-song");
const topGenresField = document.getElementById("top-genres");

const noDataMsg = document.getElementById("no-data-msg");
const infoTable = document.querySelector(".info-table");

// Table rows
const mostListenedCountRow = document.getElementById("most-listened-count-row");
const mostListenedTimeRow = document.getElementById("most-listened-time-row");
const artistCountRow = document.getElementById("artist-count-row");
const artistTimeRow = document.getElementById("artist-time-row");
const fridayCountRow = document.getElementById("friday-count-row");
const fridayTimeRow = document.getElementById("friday-time-row");
const longestStreakSongRow = document.getElementById("longest-streak-row");
const everydaySongsRow = document.getElementById("everyday-songs-row");
const topGenresRow = document.getElementById("top-genres-row");

// Event listeners
userSelect.addEventListener("change", renderData);

// Initialize function
function init() {
  createUserOptions();
  renderData();
}

// Create user options
function createUserOptions() {
  const users = getUserIDs();
  users.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User: ${id}`;
    userSelect.appendChild(option);
  });
}

// Render data
function renderData() {
  const userID = userSelect.value;
  tableHeaderUser.textContent = `User ${userID}`;

  const events = getListenEvents(userID);
  if (events.length === 0) {
    noDataMsg.hidden = false;
    infoTable.hidden = true;
    return;
  }

  noDataMsg.hidden = true;
  infoTable.hidden = false;
  const data = getUserData(userID);
  populateTable(data);
}

// Get user data
function getUserData(userID) {
  const topSongID = mostListenedSongID(userID);
  const topSongTimeID = mostListenedSongTime(userID);
  const topArtist = getMostListenedArtist(userID);
  const topArtistTime = getMostListenedArtistTime(userID);
  const topSongOnFridayID = getMostListenedOnFriday(userID);
  const topSongOnFridayTimeID = getMostListenedOnFridayTime(userID);
  const [longestStreakSongID, bestStreak] = highestStreakSongID(userID);
  const userGenreCount = getTopGenres(userID);

  return {
    topSongArtist: topSongID ? getSong(topSongID).artist : null,
    topSongTitle: topSongID ? getSong(topSongID).title : null,
    topSongTimeArtist: topSongTimeID ? getSong(topSongTimeID).artist : null,
    topSongTimeTitle: topSongTimeID ? getSong(topSongTimeID).title : null,
    topArtist,
    topArtistTime,
    topFridayArtist: topSongOnFridayID
      ? getSong(topSongOnFridayID).artist
      : null,
    topFridayTitle: topSongOnFridayID ? getSong(topSongOnFridayID).title : null,
    topFridayTimeArtist: topSongOnFridayTimeID
      ? getSong(topSongOnFridayTimeID).artist
      : null,
    topFridayTimeTitle: topSongOnFridayTimeID
      ? getSong(topSongOnFridayTimeID).title
      : null,
    longestStreakSongArtist: getSong(longestStreakSongID).artist,
    longestStreakSong: getSong(longestStreakSongID).title,
    bestStreak: bestStreak,
    userGenreCount: userGenreCount,
  };
}

// Populate table with data
function populateTable(data) {
  mostListenedCount.textContent = `${data.topSongArtist} - ${data.topSongTitle}`;
  mostListenedTime.textContent = `${data.topSongTimeArtist} - ${data.topSongTimeTitle}`;
  mostListenedArtist.textContent = data.topArtist;
  mostListenedArtistTime.textContent = data.topArtistTime;

  if (data.topFridayArtist) {
    fridayCountRow.hidden = false;
    fridayTimeRow.hidden = false;
    mostListenedFriday.textContent = `${data.topFridayArtist} - ${data.topFridayTitle}`;
    mostListenedFridayTime.textContent = `${data.topFridayTimeArtist} - ${data.topFridayTimeTitle}`;
  } else {
    fridayCountRow.hidden = true;
    fridayTimeRow.hidden = true;
  }

  longestStreakSongField.textContent = `${data.longestStreakSongArtist} - ${data.longestStreakSong} (Longest streak: ${data.bestStreak})`;
  topGenresField.textContent = `${data.userGenreCount.join(", ")}`;
}

init();
