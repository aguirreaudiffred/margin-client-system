import { normalizeProductWeight } from "./weightUnits.js";

const COL = {
  sku: ["sku", "clave", "codigo", "código", "code", "id"],
  name: ["nombre", "name", "descripcion", "descripción", "producto", "product"],
  category: ["categoria", "categoría", "category", "cat", "familia"],
  brand: ["marca", "brand"],
  listPriceUSD: ["lista", "lista_usd", "precio", "precio_usd", "list", "listpriceusd", "pvp"],
  costMXN: ["costo", "costo_mxn", "costmxn", "costo mxn"],
  weight: ["peso", "weight", "peso_kg", "peso_lbs", "peso caja", "peso/caja"],
  weightKg: ["peso_kg", "kg", "weight_kg", "kilos", "kilogramos"],
  weightLbs: ["peso_lbs", "lbs", "lb", "weight_lbs", "libras"],
  unit: ["unidad", "unit", "uom", "medida"],
};

function normHeader(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_");
}

function findCol(headers, keys) {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (keys.some((k) => h === k || h.includes(k))) return i;
  }
  return -1;
}

function parseNum(v) {
  if (v == null || v === "") return 0;
  const n = parseFloat(String(v).replace(/,/g, "").trim());
  return Number.isNaN(n) ? 0 : n;
}

function parseUnit(v) {
  const s = String(v || "")
    .trim()
    .toLowerCase();
  if (s.includes("kg") || s === "kilo" || s === "kilos") return "kg";
  if (s.includes("lb") || s.includes("libr")) return "lbs";
  return "";
}

/** Parsea CSV (exportado desde Excel). */
export function parseCatalogCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return { rows: [], errors: ["Archivo vacío"] };

  const delim = lines[0].includes("\t") ? "\t" : lines[0].includes(";") ? ";" : ",";
  const split = (line) => {
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        q = !q;
        continue;
      }
      if (!q && c === delim) {
        out.push(cur.trim());
        cur = "";
      } else cur += c;
    }
    out.push(cur.trim());
    return out;
  };

  const headers = split(lines[0]).map(normHeader);
  const idx = {
    sku: findCol(headers, COL.sku),
    name: findCol(headers, COL.name),
    category: findCol(headers, COL.category),
    brand: findCol(headers, COL.brand),
    listPriceUSD: findCol(headers, COL.listPriceUSD),
    costMXN: findCol(headers, COL.costMXN),
    weight: findCol(headers, COL.weight),
    weightKg: findCol(headers, COL.weightKg),
    weightLbs: findCol(headers, COL.weightLbs),
    unit: findCol(headers, COL.unit),
  };

  if (idx.sku < 0) return { rows: [], errors: ["Falta columna SKU o Clave"] };

  const rows = [];
  const errors = [];

  for (let li = 1; li < lines.length; li++) {
    const cells = split(lines[li]);
    if (!cells.some((c) => c)) continue;
    const sku = cells[idx.sku]?.trim();
    if (!sku) continue;

    let unit = idx.unit >= 0 ? parseUnit(cells[idx.unit]) : "";
    let weightKg = idx.weightKg >= 0 ? parseNum(cells[idx.weightKg]) : 0;
    let weightLbs = idx.weightLbs >= 0 ? parseNum(cells[idx.weightLbs]) : 0;
    const w = idx.weight >= 0 ? parseNum(cells[idx.weight]) : 0;

    if (weightKg > 0) unit = "kg";
    else if (weightLbs > 0) unit = "lbs";
    else if (w > 0 && !unit) unit = "kg";

    const base = {
      sku,
      name: idx.name >= 0 ? cells[idx.name]?.trim() || sku : sku,
      category: idx.category >= 0 ? cells[idx.category]?.trim() || "GENERAL" : "GENERAL",
      brand: idx.brand >= 0 ? cells[idx.brand]?.trim() || "" : "",
      listPriceUSD: idx.listPriceUSD >= 0 ? parseNum(cells[idx.listPriceUSD]) : 0,
      costMXN: idx.costMXN >= 0 ? parseNum(cells[idx.costMXN]) : 0,
      weightUnit: unit || "lbs",
    };

    if (weightKg > 0) base.weightKg = weightKg;
    else if (weightLbs > 0) base.weightLbs = weightLbs;
    else if (w > 0) base.weight = w;

    rows.push(normalizeProductWeight(base));
  }

  if (!rows.length) errors.push("No se encontraron filas con SKU");
  return { rows, errors };
}

/** Solo actualiza pesos por SKU (limpieza kg o velas lbs). */
export function parseWeightsCsv(text) {
  const { rows, errors } = parseCatalogCsv(text);
  if (errors.length && !rows.length) return { map: {}, errors };
  const map = {};
  rows.forEach((r) => {
    map[r.sku] = { weightKg: r.weightKg, weightLbs: r.weightLbs, weightUnit: r.weightUnit };
  });
  return { map, errors: [] };
}

export function mergeCatalogImport(existing, imported, mode = "upsert") {
  const bySku = new Map(existing.map((p) => [p.sku, p]));
  imported.forEach((row) => {
    const cur = bySku.get(row.sku);
    if (cur) {
      bySku.set(row.sku, normalizeProductWeight({ ...cur, ...row, id: cur.id }));
    } else if (mode !== "update_only") {
      bySku.set(row.sku, normalizeProductWeight({ ...row, id: `imp_${row.sku}`, costMXN: row.costMXN || 0, lastUpdated: null }));
    }
  });
  return [...bySku.values()];
}

export async function readCatalogFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const XLSX = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    return parseCatalogCsv(csv);
  }
  const text = await file.text();
  return parseCatalogCsv(text);
}
