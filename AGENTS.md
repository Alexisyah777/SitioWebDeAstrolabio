# Sitio web de Astrolabio

Sitio informativo (PWA) del videojuego *Astrolabio*, hecho con React + Vite + Tailwind CSS y publicado en Vercel. Responde y documenta siempre en **español**. Ver `README.md`.

## Servidor de desarrollo

Se usa **npm** (`package-lock.json`). `npm run dev` (puerto 8443). `/api/*` se reenvía a Astrolabio API (ver `vite.config.ts`); con `API_URL=http://localhost:3000` usa la API local.

## Contenido y API

- La historia, el mundo, los personajes, las mecánicas y los archivos vienen de **Astrolabio API** a través de `src/api.ts` (`useApi`). La base de datos de la API es la fuente de verdad: nunca escribas ese contenido en el código.
- `src/content.ts` solo guarda textos de presentación (inicio, "Qué es Astrolabio", tráiler, redes y créditos). Si algo ahí habla del juego, debe coincidir con la base de datos.
- Llama siempre a la API con rutas relativas (`/api/v1/...`): `vercel.json` las reenvía a la API, así que no hace falta CORS.
- La PWA (manifest y *service worker*) se configura en `vite.config.ts`; los íconos se generan con `node scripts/generar-iconos.mjs`.
- El título, la descripción y la meta `robots` del sitio están en `index.html`.

## Estructura

- `src/main.tsx`: punto de entrada; importa `src/index.css` y monta `src/App.tsx` en `#root`.
- `src/App.tsx`: componente principal, arma las secciones.
- `src/api.ts`: cliente de Astrolabio API (tipos de respuesta, `obtener` y el hook `useApi`).
- `src/components/`: `sections.tsx` (inicio, qué es, historia, tráiler), `universe.tsx` (mundo, personajes, mecánicas, archivos, pie), `chrome.tsx` (barra de navegación, pantalla de carga, menú, reloj lateral) y `ui.tsx` (piezas compartidas e íconos pixel art).
- `src/lib.ts`: utilidades (scroll, tráiler, movimiento reducido).
- `src/index.css`: estilos globales, paleta y tema de Tailwind.
- `vite.config.ts`: React, Tailwind, PWA y el proxy de `/api`.
- `vercel.json`: framework Vite y el rewrite de `/api/*` a Astrolabio API.

## Estilos

Tailwind CSS v4 con el plugin `@tailwindcss/vite`; no hay `tailwind.config` ni PostCSS. Usa clases de Tailwind en el JSX y pon el CSS global y los tokens del tema en `src/index.css`.

- Los `@import` van primero en `src/index.css`.
- Los estilos globales de elementos (`body`, encabezados, `button`…) van dentro de `@layer base { ... }`; fuera de una capa le ganarían a las clases de Tailwind.
- Preflight ya aplica `box-sizing: border-box`, quita márgenes y hereda la fuente en los controles; no lo repitas.
