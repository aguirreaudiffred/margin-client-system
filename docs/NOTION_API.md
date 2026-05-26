# Sincronizar ventas desde Notion (paso 2)

## 1. Crear integración en Notion

1. https://www.notion.so/my-integrations → **New integration**
2. Copia el **Internal Integration Secret** → `NOTION_TOKEN`

## 2. Compartir la base

En tu base del reporte de ventas → **⋯** → **Connections** → agrega la integración.

Copia el **Database ID** de la URL:

`https://www.notion.so/WORKSPACE/DATABASE_ID?v=...`

## 3. Variables en Vercel

Proyecto `margin-client-system` → **Settings** → **Environment Variables**:

| Variable | Valor |
|----------|--------|
| `NOTION_TOKEN` | secret de la integración |
| `NOTION_DATABASE_ID` | ID de la base (32 caracteres con guiones) |

**Redeploy** después de guardar.

## 4. Usar en la app

- **GitHub Pages:** Ventas → Actualizar reporte → **Sincronizar desde Notion API** (el build ya apunta a `https://margin-client-system.vercel.app/api/notion-sync`).
- **Local:** en `.env.local` pon `VITE_NOTION_SYNC_URL=http://localhost:3000/api/notion-sync` si corres con `vercel dev`.

## Columnas esperadas (nombres como en el Excel)

Client, Amount, ` PO` o PO, PO Date, Product, Sales Representative, Delivery Date, Status.
