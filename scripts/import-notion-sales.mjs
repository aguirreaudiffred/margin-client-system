import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import XLSX from "xlsx";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const xlsxPath =
  process.argv[2] ||
  "/Users/alejandroaguirre/Downloads/Notion Reporte Semana 18-22 Mayo.xlsx";

const wb = XLSX.readFile(xlsxPath, { cellDates: true });
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });

const { parseNotionSalesRows } = await import("../src/lib/salesImport.js");
const { lines } = parseNotionSalesRows(rows, {
  batchId: "notion_mayo_18_22",
  reportLabel: "Semana 18-22 Mayo 2026",
  importedAt: new Date().toISOString(),
});

const out = join(root, "src/data/sales-seed.json");
writeFileSync(
  out,
  JSON.stringify(
    {
      meta: {
        reportLabel: "Semana 18-22 Mayo 2026",
        batchId: "notion_mayo_18_22",
        sourceFile: xlsxPath.split("/").pop(),
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
