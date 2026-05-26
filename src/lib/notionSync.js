/** Cliente: sincroniza ventas desde API (Vercel /api/notion-sync). */

const DEFAULT_URL = "/api/notion-sync";

export function notionSyncUrl() {
  return (import.meta.env.VITE_NOTION_SYNC_URL || DEFAULT_URL).replace(/\/$/, "");
}

export async function fetchNotionSales() {
  const url = notionSyncUrl();
  const res = await fetch(url, { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Sync falló (${res.status})`);
  }
  if (!data.lines?.length) {
    const err = data.errors?.join(" ") || "Notion no devolvió ventas";
    throw new Error(err);
  }
  return data;
}
