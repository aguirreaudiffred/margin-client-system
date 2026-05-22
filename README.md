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

## Web pública (cualquiera con el link)

- **Vercel:** https://margin-client-system.vercel.app
- **GitHub Pages:** https://aguirreaudiffred.github.io/margin-client-system/

Si Vercel muestra *Connection failed* al importar el repo, usa el link de arriba o sigue `DEPLOY.md`.

### PDF / Claude (opcional)

Vercel → proyecto → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `VITE_ANTHROPIC_API_KEY` | tu key de Anthropic |

Guarda y **Redeploy** el último deployment.

## Repositorio

https://github.com/aguirreaudiffred/margin-client-system

Proyecto independiente de Sharp Picks / ClaudeCode.
