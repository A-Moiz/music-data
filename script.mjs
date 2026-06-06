// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

// Imports
import { countUsers } from "./common.mjs";
import { getUserIDs, getListenEvents, getSong } from "./data.mjs";

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

const noDataMsg = document.getElementById("no-data-msg");
const infoTable = document.querySelector(".info-table");

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
  const [
    topSongArtist,
    topSongTitle,
    topSongTimeArtist,
    topSongTimeTitle,
    topArtist,
    topArtistTime,
  ] = getUserData(userID);

  populateTable(
    topSongArtist,
    topSongTitle,
    topSongTimeArtist,
    topSongTimeTitle,
    topArtist,
    topArtistTime,
  );
}

// Get user data
function getUserData(userID) {
  const topSongID = mostListenedSongID(userID);
  const topSongTimeID = mostListenedSongTime(userID);

  const topSongArtist = getSong(topSongID).artist;
  const topSongTitle = getSong(topSongID).title;

  const topSongTimeArtist = getSong(topSongTimeID).artist;
  const topSongTimeTitle = getSong(topSongTimeID).title;

  const topArtist = getMostListenedArtist(userID);
  const topArtistTime = getMostListenedArtistTime(userID);

  return [
    topSongArtist,
    topSongTitle,
    topSongTimeArtist,
    topSongTimeTitle,
    topArtist,
    topArtistTime,
  ];
}

// Get most listened song by count
function mostListenedSongID(userID) {
  const songCounts = {};
  for (const event of getListenEvents(userID)) {
    songCounts[event.song_id] = (songCounts[event.song_id] ?? 0) + 1;
  }
  return Object.entries(songCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened song by time
function mostListenedSongTime(userID) {
  const songCounts = {};
  for (const event of getListenEvents(userID)) {
    songCounts[event.song_id] = (songCounts[event.song_id] ?? 0) + 1;
  }

  return Object.entries(songCounts).sort(([idA, countA], [idB, countB]) => {
    const timeA = countA * getSong(idA).duration_seconds;
    const timeB = countB * getSong(idB).duration_seconds;
    return timeB - timeA;
  })[0][0];
}

// Get most listened artist
function getMostListenedArtist(userID) {
  const artistCounts = {};
  for (const event of getListenEvents(userID)) {
    const artist = getSong(event.song_id).artist;
    artistCounts[artist] = (artistCounts[artist] ?? 0) + 1;
  }
  return Object.entries(artistCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened artist by time
function getMostListenedArtistTime(userID) {
  const artistTimes = {};
  for (const event of getListenEvents(userID)) {
    const song = getSong(event.song_id);
    artistTimes[song.artist] =
      (artistTimes[song.artist] ?? 0) + song.duration_seconds;
  }
  return Object.entries(artistTimes).sort(([, a], [, b]) => b - a)[0][0];
}

// Populate table with data
function populateTable(
  topSongArtist,
  topSongTitle,
  topSongTimeArtist,
  topSongTimeTitle,
  topArtist,
  topArtistTime,
) {
  mostListenedCount.textContent = `${topSongArtist} - ${topSongTitle}`;
  mostListenedTime.textContent = `${topSongTimeArtist} - ${topSongTimeTitle}`;
  mostListenedArtist.textContent = `${topArtist}`;
  mostListenedArtistTime.textContent = `${topArtistTime}`;
}

init();
