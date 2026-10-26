# ASTROLABIO · Sitio web (PWA)

Sitio informativo del videojuego *Astrolabio*: historia, mundo, personajes, mecánicas y archivos.
Se puede instalar como app (PWA) y, después de la primera visita, funciona sin conexión.

React 19 + Vite 8 + Tailwind CSS 4, publicado en **Vercel**.

## De dónde sale el contenido

El contenido del juego viene de **[Astrolabio API](https://github.com/Natanael2005/astrolabio-api)**, la misma API de solo lectura que usa la app Android. La API lee la base de datos que el equipo edita en Supabase. Así el sitio y la app muestran siempre lo mismo.

| Sección | Ruta de la API |
|---|---|
| Historia | `GET /api/v1/historia` |
| Mundo (mapa y ficha de cada zona) | `GET /api/v1/mapa`, `GET /api/v1/zonas/:slug` |
| Personajes (tarjeta y "Ver más") | `GET /api/v1/personajes`, `GET /api/v1/personajes/:slug` |
| Mecánicas, acciones y reglas | `GET /api/v1/mecanicas` |
| Archivos (colecciones y cada texto) | `GET /api/v1/archivos`, `GET /api/v1/archivos/:slug` |

- El cliente y los tipos de cada respuesta están en [`src/api.ts`](src/api.ts). El contrato completo está en el [`docs/ENDPOINTS.md` de la API](https://github.com/Natanael2005/astrolabio-api/blob/develop/docs/ENDPOINTS.md).
- [`src/content.ts`](src/content.ts) solo guarda textos de presentación (inicio, "Qué es Astrolabio", tráiler, redes y créditos). Si algo ahí habla del juego, debe coincidir con la base de datos.
- **Para cambiar el contenido del juego no se toca este repositorio**: se edita en Supabase y el sitio lo muestra en la siguiente visita.

### Por qué no hay CORS

El sitio llama a la API con rutas relativas (`/api/v1/...`):

- **En Vercel**, [`vercel.json`](vercel.json) reenvía `/api/*` a `https://astrolabio-api.vercel.app`.
- **En local**, lo hace el proxy de [`vite.config.ts`](vite.config.ts).

Para el navegador, el sitio y la API están en el mismo dominio.

## Desarrollo

Requisitos: Node.js 22 o más reciente y pnpm (versiones en [`.mise.toml`](.mise.toml)).

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:8443`. Por defecto usa la API publicada.

Para usar la API en tu computadora (corriendo con `npm run dev` en el repositorio de la API):

```bash
API_URL=http://localhost:3000 pnpm dev
```

| Comando | Para qué |
|---|---|
| `pnpm dev` | Servidor de desarrollo, con recarga al guardar. El *service worker* no se activa aquí. |
| `pnpm build` | Compila en `dist/`, con el manifest y el *service worker*. |
| `pnpm preview` | Sirve `dist/` como en producción, para probar la PWA y el modo sin conexión. |
| `node scripts/generar-iconos.mjs` | Vuelve a generar los íconos y el favicon en `public/`. |

## PWA y modo sin conexión

Se configura en `vite.config.ts` con `vite-plugin-pwa`:

- **El sitio** (HTML, JS, CSS e íconos) se guarda al instalarse el *service worker*.
- **Las respuestas de la API** usan primero la red. Si tarda más de 8 s, no hay conexión o la API responde 500, se muestra la última respuesta guardada.
- **Las imágenes de Supabase Storage y las fuentes** se guardan la primera vez que se ven.
- **Si no hay nada guardado y la API no responde**, cada sección muestra "Señal interrumpida" con un botón **Reintentar**.

La primera visita después de un rato puede tardar unos segundos: Vercel "despierta" la API (arranque en frío). El sitio espera hasta 15 s y reintenta una vez.

## Publicar en Vercel

1. En [vercel.com](https://vercel.com), pulsa **Add New… → Project** e importa este repositorio.
2. **Framework Preset:** Vite (lo toma de `vercel.json`). No hace falta cambiar nada más ni agregar variables de entorno: el sitio no guarda secretos.
3. Pulsa **Deploy**. Cada fusión a `main` publica una versión nueva.

Para comprobar, abre `https://<tu-dominio>/api/v1/salud`. Debe responder `{"data":{"estado":"ok","baseDeDatos":"ok"}}` a través del rewrite.

> `.figma/make/site.json` tiene `"robots": { "index": false }`, así que el sitio les pide a los buscadores que no lo indexen. Cámbialo a `true` cuando quieran que aparezca en Google.
