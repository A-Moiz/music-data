import { getListenEvents, getSong } from "./data.mjs";

// Get the ID of the song that was listened to the most times
export function mostListenedSongID(userID) {
  const songPlayCounts = {};
  const events = getListenEvents(userID);
  if (events.length === 0) return null;

  for (const event of events) {
    songPlayCounts[event.song_id] = (songPlayCounts[event.song_id] ?? 0) + 1;
  }

  if (Object.keys(songPlayCounts).length === 0) return null;
  return Object.entries(songPlayCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened song by time
export function mostListenedSongTime(userID) {
  const songCounts = {};
  const events = getListenEvents(userID);
  if (events.length === 0) return null;

  for (const event of events) {
    songCounts[event.song_id] = (songCounts[event.song_id] ?? 0) + 1;
  }

  // number of times song was listened to multiplied by duration
  // of the song gives total time spent listening to that song
  return Object.entries(songCounts).sort(([idA, countA], [idB, countB]) => {
    const timeA = countA * getSong(idA).duration_seconds;
    const timeB = countB * getSong(idB).duration_seconds;
    return timeB - timeA;
  })[0][0];
}

// Get most listened artist by count
export function getMostListenedArtist(userID) {
  const artistCounts = {};
  const events = getListenEvents(userID);
  if (events.length === 0) return null;

  for (const event of events) {
    const artist = getSong(event.song_id).artist;
    artistCounts[artist] = (artistCounts[artist] ?? 0) + 1;
  }

  return Object.entries(artistCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened artist by time
export function getMostListenedArtistTime(userID) {
  const artistTimes = {};
  const events = getListenEvents(userID);
  if (events.length === 0) return null;

  for (const event of events) {
    const song = getSong(event.song_id);
    artistTimes[song.artist] =
      (artistTimes[song.artist] ?? 0) + song.duration_seconds;
  }

  return Object.entries(artistTimes).sort(([, a], [, b]) => b - a)[0][0];
}

// Check if date falls under Friday night (5pm - 4am)
export function isFridayNight(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay(); // Sunday - Saturday : 0 - 6 [1]
  const hour = date.getHours();
  return (day === 5 && hour >= 17) || (day === 6 && hour < 4);
}

// Get most listened song on Friday night by count
export function getMostListenedOnFriday(userID) {
  const songCounts = {};
  const events = getListenEvents(userID);
  if (events.length === 0) return null;

  for (const event of events) {
    if (!isFridayNight(event.timestamp)) continue;
    songCounts[event.song_id] = (songCounts[event.song_id] ?? 0) + 1;
  }

  if (Object.keys(songCounts).length === 0) return null;
  return Object.entries(songCounts).sort(([, a], [, b]) => b - a)[0][0];
}

// Get most listened song on Friday night by time
export function getMostListenedOnFridayTime(userID) {
  const songTimes = {};
  const events = getListenEvents(userID);
  if (events.length === 0) return null;

  for (const event of events) {
    if (!isFridayNight(event.timestamp)) continue;
    const song = getSong(event.song_id);
    songTimes[event.song_id] =
      (songTimes[event.song_id] ?? 0) + song.duration_seconds;
  }

  if (Object.keys(songTimes).length === 0) return null;
  return Object.entries(songTimes).sort(([, a], [, b]) => b - a)[0][0];
}

// Finding longest streak song
export function highestStreakSongID(userID) {
  const events = getListenEvents(userID);
  if (events.length === 0) return null;

  let bestSongID = events[0].song_id;
  let bestStreak = 1;

  let currentSongID = events[0].song_id;
  let currentStreak = 1;

  for (let i = 1; i < events.length; i++) {
    const songID = events[i].song_id;
    if (songID === currentSongID) {
      currentStreak += 1;
    } else {
      currentSongID = songID;
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      bestSongID = currentSongID;
    }
  }

  return [bestSongID, bestStreak];
}

// Finding top genres
export function getTopGenres(userID) {
  const events = getListenEvents(userID) || [];
  const genreCounts = {};

  for (const event of events) {
    const genre = getSong(event.song_id)?.genre;
    if (genre) {
      genreCounts[genre] = (genreCounts[genre] ?? 0) + 1;
    }
  }

  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
}

// Reference:
// [1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
