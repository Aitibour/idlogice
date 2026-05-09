#!/usr/bin/env node
// Cross-platform build wrapper that clears __NEXT_PRIVATE_STANDALONE_CONFIG
// before running next build, preventing injection from other VS Code workspaces.
// Always uses --webpack because @netlify/plugin-nextjs 5.x cannot bundle turbopack chunks.
delete process.env.__NEXT_PRIVATE_STANDALONE_CONFIG;
const { spawnSync } = require("child_process");
const isWindows = process.platform === "win32";
const result = spawnSync(
  isWindows ? "cmd" : "node",
  isWindows
    ? ["/c", "node_modules\\.bin\\next", "build", "--webpack"]
    : ["node_modules/.bin/next", "build", "--webpack"],
  { stdio: "inherit", shell: false }
);
process.exit(result.status ?? 1);
