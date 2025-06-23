const fs = require("fs");
const path = require("path");

const svgPath = path.join(__dirname, "..", "public", "경기도_시군구_경계.svg");
const svgContent = fs.readFileSync(svgPath, "utf-8");

const regexes = [
  /<path[^>]*id="([^"]+)"[^>]*d="([^"]+)"[^>]*/g,
  /<path[^>]*d="([^"]+)"[^>]*id="([^"]+)"[^>]*/g,
];
const paths = [];
const seen = new Set();

for (const regex of regexes) {
  let match;
  while ((match = regex.exec(svgContent)) !== null) {
    let id, d;
    if (match[1].startsWith("M") || match[1].startsWith("m")) {
      d = match[1];
      id = match[2];
    } else {
      id = match[1];
      d = match[2];
    }
    if (!seen.has(id) && (d.startsWith("M") || d.startsWith("m"))) {
      paths.push({ id, d });
      seen.add(id);
    }
  }
}

console.log("module.exports = ", JSON.stringify(paths, null, 2), ";");
