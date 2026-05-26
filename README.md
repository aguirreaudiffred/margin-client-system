# Margin & Client System

Dashboard de ventas Notion, márgenes estimados por tipo de producto, catálogo y vendedores (Formexa).

## Link oficial (usa este)

**https://aguirreaudiffred.github.io/margin-client-system/**

Debe verse en el encabezado: **FORMEXA USA LLC · Notion v4** y pestañas **Dashboard · Ventas · Catálogo** (sin Carlos/Laura/Roberto/Patricia).

Recarga forzada si ves datos viejos: **Cmd + Shift + R** (Mac) o ventana privada.

> `https://margin-client-system.vercel.app` redirige a GitHub Pages. La API de Notion sigue en Vercel: `/api/notion-sync`.

## Desarrollo local

```bash
cd margin-client-system
npm install
cp .env.example .env.local
npm run dev
```

http://127.0.0.1:5174

## Actualizar ventas

1. **Lunes:** Ventas → Actualizar reporte → sube el Excel de Notion.
2. **Automático (paso 2):** botón *Sincronizar desde Notion API* (requiere token en Vercel).

Regenerar seed desde Excel:

```bash
node scripts/import-notion-sales.mjs "/ruta/Notion Reporte....xlsx"
```

## Márgenes estimados (sobre venta del reporte)

| Tipo | % |
|------|---|
| Velas | 23% |
| Detergente | 6% |
| Bebidas | 10% |
| Mixto | 15% |

## Repositorio

https://github.com/aguirreaudiffred/margin-client-system

Deploy: cada push a `main` publica GitHub Pages (workflow `.github/workflows/deploy-pages.yml`).
