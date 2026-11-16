const { spawnSync } = require("node:child_process");
const { renameSync, rmSync, statSync } = require("node:fs");
const { join } = require("node:path");
const ffmpeg = require("ffmpeg-static");

const directory = join(__dirname, "..", "public", "videos");
const originals = [
  "12731031_3840_2160_24fps.mp4",
  "17765268-uhd_3840_2160_30fps.mp4",
  "5135877-uhd_3840_2160_25fps.mp4",
  "7009788-uhd_3840_2160_25fps.mp4",
];

for (const [index, original] of originals.entries()) {
  const input = join(directory, original);
  const name = `home-hero-${index + 1}-720p`;
  const output = join(directory, `${name}.mp4`);
  const cached = statSync(output, { throwIfNoEntry: false });
  if (cached?.size && cached.mtimeMs >= statSync(input).mtimeMs) continue;

  const temporary = join(directory, `.${name}-${process.pid}.mp4`);
  console.log(`Preparing ${name}.mp4`);
  try {
    const result = spawnSync(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-nostdin", "-y", "-i", input,
      "-vf", "scale=1280:-2:flags=lanczos,fps=24", "-an",
      "-c:v", "libx264", "-threads", "2", "-preset", "fast", "-crf", "28",
      "-maxrate", "800k", "-bufsize", "1200k", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", temporary,
    ], { stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`FFmpeg failed for ${original}`);
    renameSync(temporary, output);
  } finally {
    rmSync(temporary, { force: true });
  }
}
