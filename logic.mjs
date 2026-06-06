import { getListenEvents, getSong } from "./data.mjs";

// Get most listened song by count
export function mostListenedSongID(userID) {
  const songCounts = {};
  for (const event of getListenEvents(userID)) {
    songCounts[event.song_id] = (songCounts[event.song_id] ?? 0) + 1;
  }
  return Object.entries(songCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened song by time
export function mostListenedSongTime(userID) {
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

// Get most listened artist by count
export function getMostListenedArtist(userID) {
  const artistCounts = {};
  for (const event of getListenEvents(userID)) {
    const artist = getSong(event.song_id).artist;
    artistCounts[artist] = (artistCounts[artist] ?? 0) + 1;
  }
  return Object.entries(artistCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened artist by time
export function getMostListenedArtistTime(userID) {
  const artistTimes = {};
  for (const event of getListenEvents(userID)) {
    const song = getSong(event.song_id);
    artistTimes[song.artist] =
      (artistTimes[song.artist] ?? 0) + song.duration_seconds;
  }
  return Object.entries(artistTimes).sort(([, a], [, b]) => b - a)[0][0];
}

// Check if date falls under Friday night (5pm - 4am)
export function isFridayNight(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const hour = date.getHours();
  return (day === 5 && hour >= 17) || (day === 6 && hour < 4);
}

// Get most listened song on Friday night by count
export function getMostListenedOnFriday(userID) {
  const songCounts = {};
  for (const event of getListenEvents(userID)) {
    if (!isFridayNight(event.timestamp)) continue;
    songCounts[event.song_id] = (songCounts[event.song_id] ?? 0) + 1;
  }
  if (Object.keys(songCounts).length === 0) return null;
  return Object.entries(songCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened song on Friday night by time
export function getMostListenedOnFridayTime(userID) {
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
