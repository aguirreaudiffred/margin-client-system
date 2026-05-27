import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import XLSX from "xlsx";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const xlsxPath =
  process.argv[2] ||
  "/Users/alejandroaguirre/Downloads/Notion Reporte Semana 18-22 Mayo.xlsx";

const sourceFile = xlsxPath.split("/").pop();
const batchId = `notion_${sourceFile.replace(/\W+/g, "_").slice(0, 40).toLowerCase()}`;

const wb = XLSX.readFile(xlsxPath, { cellDates: true });
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });

const { parseNotionSalesRows } = await import("../src/lib/salesImport.js");
const { lines } = parseNotionSalesRows(rows, {
  batchId,
  reportLabel: "Semana 18-22 Mayo 2026",
  importedAt: new Date().toISOString(),
});

const empty = lines.filter((l) => !l.sellerName).length;
const inferred = lines.filter((l) => l.sellerInferred).length;
console.log(`Sellers: ${lines.length - empty} assigned, ${inferred} inferred, ${empty} sin asignar`);

const out = join(root, "src/data/sales-seed.json");
writeFileSync(
  out,
  JSON.stringify(
    {
      meta: {
        reportLabel: "Semana 18-22 Mayo 2026",
        batchId,
        sourceFile,
        importedAt: new Date().toISOString(),
        rowCount: lines.length,
      },
      lines,
    },
    null,
    2,
  ) + "\n",
);

console.log(`Wrote ${lines.length} sales lines to ${out}`);
