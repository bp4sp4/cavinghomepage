const fs = require("fs");
const path = require("path");

const region = process.argv[2]; // 예: "경상남도"
if (!region) {
  console.error(
    "지역명을 인자로 입력하세요. 예: node svg-paths-to-array.js 경상남도"
  );
  process.exit(1);
}

const svgPath = path.join(
  __dirname,
  "..",
  "public",
  `${region}_시군구_경계.svg`
);
const outPath = path.join(__dirname, "..", "src", "data", `${region}-paths.ts`);
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

const tsContent = `export interface RegionPath {\n  id: string;\n  d: string;\n}\nconst ${region}Paths: RegionPath[] = ${JSON.stringify(
  paths,
  null,
  2
)};\nexport default ${region}Paths;\n`;

fs.writeFileSync(outPath, tsContent, "utf-8");
console.log(`✅ ${outPath} 파일이 생성되었습니다.`);
