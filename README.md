# Margin & Client System

Dashboard de márgenes, pedidos confirmados, catálogo de productos y vendedores (Formexa). Proyecto **independiente** de Sharp Picks / ClaudeCode.

## Requisitos

- Node.js 18+
- npm

## Desarrollo local

```bash
cd margin-client-system
npm install
cp .env.example .env.local   # opcional: VITE_ANTHROPIC_API_KEY para importar PDFs
npm run dev
```

Abre http://127.0.0.1:5174

## Build

```bash
npm run build
npm run preview
```

## Origen

La UI proviene de `margin-system.jsx`. Los datos de ejemplo van embebidos en `src/App.jsx`.

## Web pública

**URL en vivo:** https://aguirreaudiffred.github.io/margin-client-system/

Sitio estático publicado desde la rama `gh-pages` (GitHub Pages). Tras cambios en la app:

```bash
npm run build -- --base=/margin-client-system/
# publicar contenido de dist/ en la rama gh-pages
```

## Repositorio

https://github.com/aguirreaudiffred/margin-client-system

Proyecto independiente de Sharp Picks / ClaudeCode.
