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

## Web (producción)

App desplegada en Vercel (cualquiera con el link puede abrirla):

**https://margin-client-system.vercel.app**

(Puede tardar 1–2 min tras un push si el deploy automático está activo.)

### Variables en Vercel (opcional)

Para importar PDFs con Claude, en el proyecto Vercel → Settings → Environment Variables:

- `VITE_ANTHROPIC_API_KEY` = tu API key de Anthropic

Luego redeploy.

## Repositorio

https://github.com/aguirreaudiffred/margin-client-system

Proyecto independiente de Sharp Picks / ClaudeCode.
