#!/usr/bin/env node
// Cross-platform build wrapper that clears __NEXT_PRIVATE_STANDALONE_CONFIG
// before running next build, preventing injection from other VS Code workspaces.
// Always uses --webpack because @netlify/plugin-nextjs 5.x cannot bundle turbopack chunks.
delete process.env.__NEXT_PRIVATE_STANDALONE_CONFIG;
const { spawnSync } = require("child_process");
// Use npm exec for reliable cross-platform invocation of the next binary.
// shell: true is required on Windows to resolve npm.cmd via PATH.
const result = spawnSync(
  "npm",
  ["exec", "--", "next", "build", "--webpack"],
  { stdio: "inherit", shell: true }
);
process.exit(result.status ?? 1);
