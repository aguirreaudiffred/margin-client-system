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

## Web pública (Vercel) — 2 minutos

El repo ya incluye `vercel.json`. Conéctalo una vez en Vercel:

1. Abre [vercel.com/new](https://vercel.com/new) e inicia sesión.
2. **Import Git Repository** → elige `aguirreaudiffred/margin-client-system`.
3. Deja **Framework Preset: Vite** (detectado solo).
4. **Deploy** (sin cambiar `Build Command` ni `Output Directory`).

Cuando termine, Vercel te da una URL tipo:

**https://margin-client-system.vercel.app**

Cada `git push` a `main` vuelve a publicar la app.

### PDF / Claude (opcional)

Vercel → proyecto → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `VITE_ANTHROPIC_API_KEY` | tu key de Anthropic |

Guarda y **Redeploy** el último deployment.

## Repositorio

https://github.com/aguirreaudiffred/margin-client-system

Proyecto independiente de Sharp Picks / ClaudeCode.
