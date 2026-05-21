# Margin & Client Sistem

Dashboard de márgenes, pedidos confirmados, catálogo de productos y vendedores (Formexa). Proyecto **independiente** de Sharp Picks / ClaudeCode.

## Requisitos

- Node.js 18+
- npm

## Desarrollo local

```bash
cd margin-client-sistem
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

## Repositorio

Este directorio es su propio repositorio Git. No forma parte del monorepo Sharp Picks.
