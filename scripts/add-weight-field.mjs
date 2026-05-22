import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "src/data/products.json");
const products = JSON.parse(readFileSync(path, "utf8"));
const updated = products.map((p) => ({
  ...p,
  weightLbs: p.weightLbs ?? 0,
  weightNote: p.weightNote ?? "lbs por caja",
}));
writeFileSync(path, JSON.stringify(updated, null, 2) + "\n");
console.log(`Updated ${updated.length} products with weightLbs`);
