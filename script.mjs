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
const mostListenedFriday = document.getElementById("friday-song-count");
const mostListenedFridayTime = document.getElementById("friday-song-time");

const noDataMsg = document.getElementById("no-data-msg");
const infoTable = document.querySelector(".info-table");
const fridayCountRow = document.getElementById("friday-count-row");
const fridayTimeRow = document.getElementById("friday-time-row");

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

  return {
    topSongArtist: getSong(topSongID).artist,
    topSongTitle: getSong(topSongID).title,
    topSongTimeArtist: getSong(topSongTimeID).artist,
    topSongTimeTitle: getSong(topSongTimeID).title,
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
  };
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

// Check if date falls under Friday night (5pm - 4am)
function isFridayNight(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const hour = date.getHours();

  // Day = 5 = Friday, Hour >= 17 = 5pm onwards
  // Day 6 = Saturday, hour < 4 = Before 4am
  // Thus checking if timestamp falls between 5pm and 4am on Friday/Saturday
  return (day === 5 && hour >= 17) || (day === 6 && hour < 4);
}

// Get most listened song on Friday night
function getMostListenedOnFriday(userID) {
  const songCounts = {};
  for (const event of getListenEvents(userID)) {
    if (!isFridayNight(event.timestamp)) continue;
    songCounts[event.song_id] = (songCounts[event.song_id] ?? 0) + 1;
  }

  if (Object.keys(songCounts).length === 0) return null;

  return Object.entries(songCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened song on Friday night by time
function getMostListenedOnFridayTime(userID) {
  const songTimes = {};
  for (const event of getListenEvents(userID)) {
    if (!isFridayNight(event.timestamp)) continue;
    const song = getSong(event.song_id);
    songTimes[event.song_id] =
      (songTimes[event.song_id] ?? 0) + song.duration_seconds;
  }

  if (Object.keys(songTimes).length === 0) return null;

  return Object.entries(songTimes).sort(([, a], [, b]) => b - a)[0][0];
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
}

init();
