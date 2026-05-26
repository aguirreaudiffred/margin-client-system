/** Parser reporte Notion (export Excel) → líneas de venta normalizadas. */

const SELLER_ALIASES = {
  "luis miguel perez": "Luis Miguel Perez",
  "manuel fernandez": "Manuel Fernandez",
};

export const PRODUCT_CATEGORIES = ["VELAS", "DETERGENTE", "BEBIDAS", "MIXTO", "OTRO"];

export function normKey(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ");
}

export function normClient(name) {
  const n = String(name || "").trim().replace(/\s+/g, " ");
  if (!n) return "Sin cliente";
  const k = normKey(n);
  if (k.includes("mexmore") || k.includes("mex-more")) return "MEX-MORE";
  if (k.includes("bodega guzman")) return "BODEGA GUZMAN";
  if (k.includes("tortilleria")) return "LA TORTILLERIA";
  if (k.includes("frontera")) return "FRONTERA IMPORTS";
  if (k.includes("2 fronteras")) return "2 FRONTERAS LLC";
  return n.toUpperCase();
}

export function normSellerName(raw) {
  const k = normKey(raw);
  if (!k) return "";
  return SELLER_ALIASES[k] || String(raw).trim();
}

export function normProductCategory(raw) {
  const s = String(raw || "")
    .toLowerCase()
    .replace(/\r?\n/g, " ");
  if (/bebida/.test(s)) return "BEBIDAS";
  if (/velador/.test(s)) return "VELAS";
  if (/deterg/.test(s)) return "DETERGENTE";
  if (/mixto/.test(s)) return "MIXTO";
  return "OTRO";
}

export function marginPctForCategory(category) {
  switch (category) {
    case "VELAS":
      return 0.23;
    case "DETERGENTE":
      return 0.06;
    case "BEBIDAS":
      return 0.10;
    case "MIXTO":
      return 0.15;
    default:
      return 0;
  }
}

export function parseAmount(v) {
  if (v == null || v === "") return 0;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const n = parseFloat(
    String(v)
      .replace(/[$,\s]/g, "")
      .replace(/[^\d.-]/g, ""),
  );
  return Number.isNaN(n) ? 0 : n;
}

export function parseExcelDate(v) {
  if (v == null || v === "") return null;
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === "number" && v > 40000) {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const d = new Date(epoch.getTime() + v * 86400000);
    return d.toISOString().slice(0, 10);
  }
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/);
  if (m) {
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const mo = months[m[2].toLowerCase().slice(0, 3)];
    if (mo == null) return null;
    let y = parseInt(m[3], 10);
    if (y < 100) y += 2000;
    const d = new Date(y, mo, parseInt(m[1], 10));
    return d.toISOString().slice(0, 10);
  }
  const d2 = new Date(s);
  if (!Number.isNaN(d2.getTime())) return d2.toISOString().slice(0, 10);
  return null;
}

function pick(row, keys) {
  for (const k of keys) {
    if (row[k] != null && row[k] !== "") return row[k];
    const found = Object.keys(row).find((h) => normKey(h) === normKey(k));
    if (found && row[found] != null && row[found] !== "") return row[found];
  }
  return "";
}

export function parseNotionSalesRows(rows, meta = {}) {
  const lines = [];
  const errors = [];

  rows.forEach((row, i) => {
    if (!row || typeof row !== "object") return;
    const client = normClient(pick(row, ["Client", "Cliente", "client"]));
    const amount = parseAmount(pick(row, ["Amount", "Monto", "amount"]));
    const po = String(pick(row, [" PO", "PO", "po"])).trim();
    if (!client && !amount && !po) return;
    if (!amount && !po) return;

    const sellerName = normSellerName(pick(row, ["Sales Representative", "Representante", "Vendedor"]));
    const productRaw = pick(row, ["Product", "Producto", "product"]);
    const productCategory = normProductCategory(productRaw);
    const marginPct = marginPctForCategory(productCategory);
    const profitUSD = amount * marginPct;
    const poDate = parseExcelDate(pick(row, ["PO Date", "Fecha PO", "po date"]));
    const deliveryDate = parseExcelDate(pick(row, ["Delivery Date", "Fecha entrega"]));
    const zone = String(pick(row, ["Delivery Location", "Zona", "Ubicacion"]) || "").trim() || "Texas";

    lines.push({
      id: `sl_${meta.batchId || "b"}_${i}_${po || client}`.replace(/\W+/g, "_").slice(0, 48),
      po: po || pick(row, ["PO Number", "po number"]) || "",
      client,
      sellerName,
      productCategory,
      productRaw: String(productRaw).trim(),
      amountUSD: amount,
      marginPct,
      profitUSD,
      poDate,
      deliveryDate,
      status: String(pick(row, ["Status", "Estatus"]) || "").trim(),
      zone,
      comments: String(pick(row, ["Comments", "Comentarios"]) || "").trim(),
      reportLabel: meta.reportLabel || "",
      batchId: meta.batchId || "",
      importedAt: meta.importedAt || new Date().toISOString(),
    });
  });

  if (!lines.length) errors.push("No se encontraron ventas en el archivo");
  return { lines, errors };
}

export async function readNotionSalesFile(file, meta = {}) {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheetName = wb.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
  const batchId =
    meta.batchId ||
    `batch_${Date.now()}_${file.name.replace(/\W+/g, "_").slice(0, 30)}`;
  const reportLabel = meta.reportLabel || file.name.replace(/\.(xlsx|xls|csv)$/i, "");
  return parseNotionSalesRows(rows, {
    ...meta,
    batchId,
    reportLabel,
    importedAt: new Date().toISOString(),
  });
}

export function mergeSales(existing, incoming, mode = "merge") {
  if (mode === "replace") return incoming;
  const key = (l) => `${l.po}|${l.client}|${l.poDate}|${l.amountUSD}`;
  const map = new Map(existing.map((l) => [key(l), l]));
  incoming.forEach((l) => map.set(key(l), l));
  return [...map.values()];
}
