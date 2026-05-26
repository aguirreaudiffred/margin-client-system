/** Vercel serverless: lee la base de Notion y devuelve líneas normalizadas. */
import { parseNotionSalesRows } from "../src/lib/salesImport.js";

function propValue(prop) {
  if (!prop || !prop.type) return "";
  switch (prop.type) {
    case "title":
      return (prop.title || []).map((t) => t.plain_text).join("").trim();
    case "rich_text":
      return (prop.rich_text || []).map((t) => t.plain_text).join("").trim();
    case "number":
      return prop.number ?? "";
    case "select":
      return prop.select?.name || "";
    case "multi_select":
      return (prop.multi_select || []).map((s) => s.name).join(", ");
    case "date":
      return prop.date?.start || "";
    case "people":
      return (prop.people || []).map((p) => p.name || "").filter(Boolean).join(", ");
    case "formula":
      if (prop.formula?.type === "number") return prop.formula.number ?? "";
      if (prop.formula?.type === "string") return prop.formula.string || "";
      return "";
    default:
      return "";
  }
}

function pageToRow(page) {
  const row = {};
  for (const [name, prop] of Object.entries(page.properties || {})) {
    row[name] = propValue(prop);
    if (name.trim() !== name) row[name.trim()] = propValue(prop);
  }
  if (!row[" PO"] && row.PO) row[" PO"] = row.PO;
  return row;
}

async function queryAllPages(token, databaseId) {
  const rows = [];
  let cursor;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.message || data.code || res.statusText;
      throw new Error(`Notion API: ${msg}`);
    }
    for (const page of data.results || []) rows.push(pageToRow(page));
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return rows;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    return res.status(503).json({
      error: "Configura NOTION_TOKEN y NOTION_DATABASE_ID en Vercel → Environment Variables",
    });
  }

  try {
    const rawRows = await queryAllPages(token, databaseId);
    const batchId = `notion_api_${Date.now()}`;
    const { lines, errors } = parseNotionSalesRows(rawRows, {
      batchId,
      reportLabel: "Notion API",
      importedAt: new Date().toISOString(),
    });
    return res.status(200).json({
      lines,
      errors,
      rowCount: lines.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
