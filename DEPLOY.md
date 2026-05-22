# Si Vercel dice "Connection failed"

## Opción A — Surge (rápida, sin conectar GitHub)

En Terminal, en esta carpeta:

```bash
npm run build
npx surge dist margin-client-system.surge.sh
```

Te pide email/contraseña de Surge la primera vez (crea cuenta gratis).

## Opción B — Vercel sin Git (subir build)

```bash
npm run build
npx vercel login
npx vercel dist --prod
```

## Opción C — Vercel + GitHub (arreglar conexión)

1. GitHub → **Settings** → **Applications** → **Vercel** → **Configure**
2. En **Repository access**, marca **All repositories** o solo `margin-client-system`
3. [vercel.com/new](https://vercel.com/new) → import de nuevo → **Deploy**

Si el repo es **privado**, Vercel debe tener acceso explícito a ese repo.

## Opción D — GitHub Pages

Repo → **Settings** → **Pages** → Branch: **gh-pages** / **root** (si existe la rama `gh-pages`).

URL: `https://aguirreaudiffred.github.io/margin-client-system/`
