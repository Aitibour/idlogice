#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..");
const nmPath = path.join(appDir, ".netlify/edge-functions/___netlify-edge-handler-node-middleware/server/node-middleware.js");
const rtPath = path.join(appDir, ".next/server/webpack-runtime.js");

let nm = fs.readFileSync(nmPath, "utf8");
let rt = fs.readFileSync(rtPath, "utf8").trimEnd().replace(/;+$/, "");

// Escape for JS string context (\ → \\ and " → \")
const rtEscaped = rt.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const BROKEN = "(function(){var module={exports:{}};();return module.exports;})()";
const FIXED = `(function(){var module={exports:{}};(${rtEscaped});return module.exports;})()`;

if (nm.includes(BROKEN)) {
  const patched = nm.replace(BROKEN, FIXED);
  fs.writeFileSync(nmPath, patched, "utf8");
  console.log("[fix] Replaced broken pattern. Size:", nm.length, "->", patched.length);
  const verify = fs.readFileSync(nmPath, "utf8");
  if (verify.includes("webpack-runtime")) {
    console.error("[fix] ERROR: webpack-runtime still present!");
  } else {
    console.log("[fix] OK: no webpack-runtime in file");
  }
  const idx = verify.indexOf("exports:{}};(");
  if (idx >= 0) {
    const ctx = verify.substring(Math.max(0, idx - 10), idx + 60);
    console.log("[fix] Pattern context:", ctx.substring(0, 80));
  }
} else {
  console.log("[fix] Broken pattern not found — checking file...");
  const idx = nm.indexOf("exports:{}};(");
  if (idx >= 0) {
    console.log("[fix] Context:", nm.substring(Math.max(0, idx - 30), idx + 60));
  } else {
    console.log("[fix] No module={exports} pattern found either");
  }
}
