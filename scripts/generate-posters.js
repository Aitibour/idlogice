#!/usr/bin/env node
/**
 * Extracts the first frame of each hero video as a JPEG poster.
 * Uses the ffmpeg binary bundled with ffmpeg-static.
 */
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ffmpeg = require("ffmpeg-static");

const VIDEOS_DIR = path.join(__dirname, "../public/videos");
const POSTERS_DIR = path.join(__dirname, "../public/posters");

if (!fs.existsSync(POSTERS_DIR)) fs.mkdirSync(POSTERS_DIR, { recursive: true });

const videos = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith(".mp4"));

for (const video of videos) {
  const input  = path.join(VIDEOS_DIR, video);
  const output = path.join(POSTERS_DIR, video.replace(".mp4", ".jpg"));

  if (fs.existsSync(output)) {
    console.log(`  skip  ${video} (poster already exists)`);
    continue;
  }

  console.log(`  poster ${video}`);
  const result = spawnSync(
    ffmpeg,
    ["-y", "-i", input, "-vframes", "1", "-q:v", "4", "-vf", "scale=1280:-2", output],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error(`  ✗ failed: ${video}`);
  } else {
    const kb = Math.round(fs.statSync(output).size / 1024);
    console.log(`  ✓ ${video.replace(".mp4",".jpg")} (${kb} KB)`);
  }
}
