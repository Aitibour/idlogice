#!/usr/bin/env node
// Patches node-middleware.js to inline webpack-runtime.js content
// This is needed because @netlify/plugin-nextjs 5.15.11 doesn't include
// webpack-runtime.js when bundling the middleware edge function.

const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..");
const nmPath = path.join(
  appDir,
  ".netlify/edge-functions/___netlify-edge-handler-node-middleware/server/node-middleware.js"
);
const rtPath = path.join(appDir, ".next/server/webpack-runtime.js");

if (!fs.existsSync(nmPath)) {
  console.error("node-middleware.js not found:", nmPath);
  process.exit(1);
}
if (!fs.existsSync(rtPath)) {
  console.error("webpack-runtime.js not found:", rtPath);
  process.exit(1);
}

let nm = fs.readFileSync(nmPath, "utf8");
let rt = fs.readFileSync(rtPath, "utf8").trimEnd();
if (rt.endsWith(";")) rt = rt.slice(0, -1); // strip trailing semicolon

// In node-middleware.js, middleware.js content is a JS string where " is escaped as \"
// We need to escape the runtime content the same way
const rtEscaped = rt.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const NEW = `(function(){var module={exports:{}};(${rtEscaped});return module.exports;})()`;

let patched = nm;
if (nm.includes('require(\\"./webpack-runtime.js\\")')) {
  patched = nm.replace('require(\\"./webpack-runtime.js\\")', NEW);
  console.log("[patch-nm] Replaced require with inlined runtime (backslash-quote form)");
} else if (nm.includes("require(\\\"./webpack-runtime.js\\\")")) {
  patched = nm.replace("require(\\\"./webpack-runtime.js\\\")", NEW);
  console.log("[patch-nm] Replaced require with inlined runtime (escaped-quote form)");
} else {
  // Try another approach: find the pattern as it appears in the raw file
  console.log("[patch-nm] Standard patterns not found, trying raw bytes approach...");

  // The string in node-middleware.js is: require(\"./webpack-runtime.js\")
  // In the raw JS file, this is the literal characters: r e q u i r e ( \ " . / w e b p a c k - r u n t i m e . j s \ " )
  const rawPattern = 'require(\\"./webpack-runtime.js\\")';
  const rawIdx = nm.indexOf(rawPattern);
  if (rawIdx >= 0) {
    patched = nm.slice(0, rawIdx) + NEW + nm.slice(rawIdx + rawPattern.length);
    console.log("[patch-nm] Replaced using raw pattern at index:", rawIdx);
  } else {
    // Search for webpack-runtime in any form
    const anyIdx = nm.indexOf("webpack-runtime");
    if (anyIdx >= 0) {
      console.log("[patch-nm] 'webpack-runtime' found at:", anyIdx);
      console.log("[patch-nm] Context:", nm.slice(Math.max(0, anyIdx - 30), anyIdx + 50));
    } else {
      console.log("[patch-nm] No webpack-runtime found - already patched or different format");
    }
    process.exit(0);
  }
}

fs.writeFileSync(nmPath, patched, "utf8");
console.log(`[patch-nm] Saved (${nm.length} -> ${patched.length} bytes)`);

// Verify
const verify = fs.readFileSync(nmPath, "utf8");
if (verify.includes("webpack-runtime")) {
  console.error("[patch-nm] ERROR: webpack-runtime still present after patch!");
} else {
  console.log("[patch-nm] VERIFIED: webpack-runtime.js removed from node-middleware.js");
}
