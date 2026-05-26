#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "..");
const standaloneDir = path.join(appDir, ".next", "standalone", ".next", "server");
const mwPath = path.join(standaloneDir, "middleware.js");
const rtPath = path.join(appDir, ".next", "server", "webpack-runtime.js");
const rtPath2 = path.join(standaloneDir, "webpack-runtime.js");
const resolvedRt = fs.existsSync(rtPath) ? rtPath : rtPath2;

if (!fs.existsSync(mwPath)) { console.log("standalone middleware.js not found"); process.exit(0); }
if (!fs.existsSync(resolvedRt)) { console.log("webpack-runtime.js not found"); process.exit(1); }

const mw = fs.readFileSync(mwPath, "utf8");
const rt = fs.readFileSync(resolvedRt, "utf8").trimEnd().replace(/;+$/, "");
const OLD = 'require("./webpack-runtime.js")';

if (!mw.includes(OLD)) {
  console.log("[patch-standalone] Pattern not found — already patched?");
  process.exit(0);
}

const inlined = `(function(){var module={exports:{}};(${rt});return module.exports;})()`;
const patched = mw.replace(OLD, inlined);
fs.writeFileSync(mwPath, patched, "utf8");
const verify = fs.readFileSync(mwPath, "utf8");
console.log("[patch-standalone] Done. webpack-runtime still present:", verify.includes("webpack-runtime"));
console.log("[patch-standalone] Size:", mw.length, "->", verify.length);
