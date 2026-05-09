#!/usr/bin/env node
/**
 * Compress all videos in public/videos/ to web-optimised 1080p H.264.
 * Audio stripped (all videos are muted in the app).
 * Output overwrites source files in-place (backup first if needed).
 */
const ffmpegPath = require("ffmpeg-static");
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const videosDir = path.join(__dirname, "../public/videos");
const tmpDir = path.join(__dirname, "../public/videos/.tmp");

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

const files = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));

for (const file of files) {
  const input = path.join(videosDir, file);
  const tmp = path.join(tmpDir, file);
  const sizeBefore = (fs.statSync(input).size / 1024 / 1024).toFixed(1);

  console.log(`\n▶ ${file}  (${sizeBefore} MB)`);

  // Scale to max 1920px wide, keep aspect; strip audio; fast-start for streaming
  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-i", input,
      "-vf", "scale='min(1920,iw)':-2",
      "-c:v", "libx264",
      "-crf", "28",
      "-preset", "fast",
      "-movflags", "+faststart",
      "-an",           // strip audio — all videos are muted
      tmp,
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    console.error(`  ✗ Failed — skipping`);
    continue;
  }

  const sizeAfter = (fs.statSync(tmp).size / 1024 / 1024).toFixed(1);
  console.log(`  ✓ ${sizeBefore} MB → ${sizeAfter} MB`);

  // Replace original only if compressed version is smaller
  if (fs.statSync(tmp).size < fs.statSync(input).size) {
    fs.copyFileSync(tmp, input);
    console.log(`  ✓ Replaced original`);
  } else {
    console.log(`  — Compressed not smaller, keeping original`);
  }
  fs.unlinkSync(tmp);
}

fs.rmdirSync(tmpDir);
console.log("\n✅ Done");
