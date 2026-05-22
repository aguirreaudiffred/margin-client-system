import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appPath = path.join(root, "src", "App.jsx");
const src = fs.readFileSync(appPath, "utf8");

function extractArray(name) {
  const marker = `const ${name}=`;
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Missing ${marker}`);
  let i = start + marker.length;
  while (src[i] === " ") i++;
  if (src[i] !== "[") throw new Error(`${name} is not an array literal`);
  let depth = 0;
  let inStr = false;
  let strQuote = "";
  let escape = false;
  for (let j = i; j < src.length; j++) {
    const ch = src[j];
    if (inStr) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === strQuote) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inStr = true;
      strQuote = ch;
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        const literal = src.slice(i, j + 1);
        // eslint-disable-next-line no-new-func
        return Function(`"use strict"; return (${literal});`)();
      }
    }
  }
  throw new Error(`Unclosed array for ${name}`);
}

const products = extractArray("P");
const orders = extractArray("O");

const dataDir = path.join(root, "public", "data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, "products.json"), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(dataDir, "orders.json"), JSON.stringify(orders, null, 2));
console.log(`Wrote ${products.length} products, ${orders.length} orders`);
