import test from "node:test";
import assert from "node:assert";
import { calculateHighestStreak } from "./logic.mjs";

// Checking if the function finds correct streak count
test("finds a streak of 3", () => {
  const events = [
    { song_id: "song-1" },
    { song_id: "song-1" },
    { song_id: "song-1" },
    { song_id: "song-2" },
  ];
  const [songID, streak] = calculateHighestStreak(events);
  assert.equal(songID, "song-1");
  assert.equal(streak, 3);
});

// Picks the longest streak of 2 streaks
test("picks the longest streak when multiple exist", () => {
  const events = [
    { song_id: "song-1" },
    { song_id: "song-1" },
    { song_id: "song-2" },
    { song_id: "song-2" },
    { song_id: "song-2" },
  ];
  const [songID, streak] = calculateHighestStreak(events);
  assert.equal(songID, "song-2");
  assert.equal(streak, 3);
});

// No streak, every song different
test("returns streak of 1 when no song repeats", () => {
  const events = [
    { song_id: "song-1" },
    { song_id: "song-2" },
    { song_id: "song-3" },
  ];
  const [, streak] = calculateHighestStreak(events);
  assert.equal(streak, 1);
});
