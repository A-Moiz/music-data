// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

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
