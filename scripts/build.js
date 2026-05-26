#!/usr/bin/env node
// Cross-platform build wrapper that clears __NEXT_PRIVATE_STANDALONE_CONFIG
// before running next build, preventing injection from other VS Code workspaces.
// Always uses --webpack because @netlify/plugin-nextjs 5.x cannot bundle turbopack chunks.
delete process.env.__NEXT_PRIVATE_STANDALONE_CONFIG;
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Use npm exec for reliable cross-platform invocation of the next binary.
// shell: true is required on Windows to resolve npm.cmd via PATH.
const result = spawnSync(
  "npm",
  ["exec", "--", "next", "build", "--webpack"],
  { stdio: "inherit", shell: true }
);

if (result.status === 0) {
  // Windows fix: @netlify/plugin-nextjs edge-runtime/lib/cjs.ts uses pathToFileURL(filepath, { windows: false })
  // which fails on Windows paths with spaces (e.g. "Claude Code"). Patch the PLUGIN SOURCE so the fix
  // survives after the plugin copies it to .netlify/edge-functions/.
  const cjsTsPaths = [
    path.join(__dirname, '..', '.netlify', 'plugins', 'node_modules',
      '@netlify', 'plugin-nextjs', 'edge-runtime', 'lib', 'cjs.ts'),
    path.join(__dirname, '..', '.netlify', 'edge-functions',
      '___netlify-edge-handler-node-middleware', 'edge-runtime', 'lib', 'cjs.ts'),
  ];
  const bad = 'pathToFileURL(filepath, { windows: false })';
  const good = "pathToFileURL(filepath, { windows: process.platform === 'win32' })";
  for (const p of cjsTsPaths) {
    if (fs.existsSync(p)) {
      const src = fs.readFileSync(p, 'utf8');
      if (src.includes(bad)) {
        fs.writeFileSync(p, src.replace(bad, good), 'utf8');
        console.log(`[build-patch] Fixed pathToFileURL windows flag in ${path.basename(path.dirname(path.dirname(p)))}/cjs.ts`);
      }
    }
  }

  // @netlify/plugin-nextjs 5.15.11 reads from .next/standalone/.next/server/ (standalone output)
  // and cannot bundle middleware.js when webpack emits a separate webpack-runtime.js.
  // Fix: inline the runtime directly into middleware.js in BOTH locations.
  const serverDir = path.join(__dirname, "..", ".next", "server");
  const standaloneServerDir = path.join(__dirname, "..", ".next", "standalone", ".next", "server");
  const runtimePath = path.join(serverDir, "webpack-runtime.js");

  function patchMiddleware(dir, label) {
    const middlewarePath = path.join(dir, "middleware.js");
    const nftPath = path.join(dir, "middleware.js.nft.json");
    const rtPath = path.join(dir, "webpack-runtime.js");

    // Use the runtime from this dir if it exists, otherwise fall back to main server dir
    const resolvedRtPath = fs.existsSync(rtPath) ? rtPath : runtimePath;
    if (!fs.existsSync(middlewarePath) || !fs.existsSync(resolvedRtPath)) return;

    const middlewareContent = fs.readFileSync(middlewarePath, "utf8");
    const runtimeContent = fs.readFileSync(resolvedRtPath, "utf8").trimEnd().replace(/;+$/, "");

    const oldRequire = 'require("./webpack-runtime.js")';
    if (!middlewareContent.includes(oldRequire)) return;

    const inlined = `(function(){var module={exports:{}};(${runtimeContent});return module.exports;})()`;
    const patched = middlewareContent.replace(oldRequire, inlined);
    fs.writeFileSync(middlewarePath, patched, "utf8");
    console.log(`[build-patch] Inlined webpack-runtime.js into ${label}/middleware.js`);

    if (fs.existsSync(nftPath)) {
      const nft = JSON.parse(fs.readFileSync(nftPath, "utf8"));
      nft.files = (nft.files || []).filter((f) => f !== "webpack-runtime.js");
      fs.writeFileSync(nftPath, JSON.stringify(nft), "utf8");
      console.log(`[build-patch] Removed webpack-runtime.js from ${label} NFT trace`);
    }
  }

  patchMiddleware(serverDir, ".next/server");
  patchMiddleware(standaloneServerDir, ".next/standalone/.next/server");
}

process.exit(result.status ?? 1);
