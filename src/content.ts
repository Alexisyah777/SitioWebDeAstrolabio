import type { IconName } from './components/ui'

/* ─────────────────────────────────────────────
 * CONTENIDO FIJO DEL SITIO
 *
 * Solo los textos de presentación viven aquí. La historia, el mundo, los
 * personajes, las mecánicas y los archivos vienen de Astrolabio API
 * (src/api.ts), que lee la base de datos que el equipo edita en Supabase.
 * Si algo de aquí habla del juego, debe coincidir con esa base de datos.
 * ───────────────────────────────────────────── */

/** Pega aquí la URL del tráiler de YouTube (watch?v=, youtu.be/ o /embed/). */
export const TRAILER_URL = ''
/** Respaldo opcional si no hay YouTube: ruta a un .mp4 (ej. '/trailer.mp4' dentro de /public). */
export const TRAILER_MP4 = ''

export const SECTIONS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'historia', label: 'Historia' },
  { id: 'trailer', label: 'Tráiler' },
  { id: 'mundo', label: 'Mundo' },
  { id: 'personajes', label: 'Personajes' },
  { id: 'mecanicas', label: 'Mecánicas' },
  { id: 'archivos', label: 'Archivos' },
] as const

export const HERO = {
  label: 'Registro del Gran Reloj Cósmico',
  title: 'CADA SECRETO, A SU TIEMPO.',
  subtitle: 'Un plataformero en pixel art sobre un autómata, un reloj roto y el tiempo que intenta repararlo.',
}

export const ABOUT = {
  body: [
    'ASTROLABIO es un juego de plataformas 2D en pixel art. Guías a Almanaque XII, un pequeño autómata de latón, en su ascenso por el Gran Reloj Cósmico: un Eje central del que cuelgan las doce Casas.',
    'Desde las Entrañas del Reloj, recorre la Casa de Géminis y la Casa de Acuario hasta la Cámara Central. Domina tus herramientas y resuelve puzzles en los que el tiempo forma parte del camino.',
  ],
  facts: [
    { icon: 'house', value: '12', label: 'Casas' },
    { icon: 'gear', value: '4', label: 'Mecánicas' },
    { icon: 'controller', value: '2D', label: 'Plataformas' },
    { icon: 'image', value: 'PX', label: 'Pixel art' },
  ] satisfies { icon: IconName; value: string; label: string }[],
}

export const SOCIALS = ['Discord', 'YouTube', 'Instagram', 'X']
export const CREDITS = 'Créditos del equipo por anunciar · Dirección · Arte pixel · Música · Programación'
