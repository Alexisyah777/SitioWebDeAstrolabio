import type { IconName } from './components/ui'

/* ─────────────────────────────────────────────
 * CONTENIDO EDITABLE (provisional)
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
    'ASTROLABIO es un juego de plataformas 2D en pixel art. Guías a Almanaque XII, un pequeño autómata de latón, a través de las Casas del Gran Reloj: seis lugares unidos por un mismo mecanismo.',
    'Explora cada Casa, domina tus herramientas y resuelve puzzles en los que el tiempo forma parte del camino.',
  ],
  facts: [
    { icon: 'house', value: '6', label: 'Casas' },
    { icon: 'gear', value: '4', label: 'Mecánicas' },
    { icon: 'controller', value: '2D', label: 'Plataformas' },
    { icon: 'image', value: 'PX', label: 'Pixel art' },
  ] satisfies { icon: IconName; value: string; label: string }[],
}

export const STORY = [
  {
    title: 'El Gran Reloj',
    text: 'El Gran Reloj es el mecanismo cósmico que mantiene el orden del tiempo. Seis lugares, un mismo mecanismo.',
    image: 'El Gran Reloj',
  },
  {
    title: 'La ruptura',
    text: 'Algo provocó su ruptura, y el anterior guardián, Almanaque XI, está ligado a ese suceso.',
    image: 'La ruptura',
  },
  {
    title: 'El despertar',
    text: 'Almanaque XII, un pequeño autómata de latón, curioso y silencioso, despierta para recorrer las Casas.',
    image: 'Almanaque XII despierta',
  },
  {
    title: 'Quien observa',
    text: 'Ephemeris, la entidad que guía y ordena a los Almanaques, lo observa.',
    image: 'Ephemeris',
  },
]

export type House = {
  id: string
  loc: string
  name: string
  short: string
  epithet: string
  chips: string[]
  rooms: string[]
  locked: boolean
  pos: { x: number; y: number }
}

const locked = (loc: string, x: number, y: number): House => ({
  id: `casa-${loc}`,
  loc,
  name: 'Casa sellada',
  short: '',
  epithet: 'Por revelar',
  chips: [],
  rooms: [],
  locked: true,
  pos: { x, y },
})

export const HOUSES: House[] = [
  locked('01', 18, 69),
  locked('02', 18, 31),
  {
    id: 'geminis',
    loc: '03',
    name: 'Casa de Géminis',
    short: 'Géminis',
    epithet: 'Casa de los Reflejos',
    chips: ['Dualidad y reflejos', 'Anclas reflejadas', 'Paredes gemelas'],
    rooms: ['Atrio de los Gemelos', 'Galería de Espejos', 'Puentes Paralelos', 'Observatorio de las Dos Lentes', 'Torre Invertida', 'Cámara de los Gemelos'],
    locked: false,
    pos: { x: 50, y: 13 },
  },
  locked('04', 82, 31),
  {
    id: 'acuario',
    loc: '05',
    name: 'Casa de Acuario',
    short: 'Acuario',
    epithet: 'Casa de las Corrientes',
    chips: ['Corrientes', 'Anclas flotantes', 'Muros húmedos', 'Esclusas'],
    rooms: ['Fuentes Rotas', 'Acueductos', 'Esclusas', 'Remolino', 'Observatorio del Cauce', 'Cámara del Portador'],
    locked: false,
    pos: { x: 82, y: 69 },
  },
  locked('06', 50, 87),
]

export const CHARACTERS = [
  {
    name: 'Almanaque XII',
    role: 'El nuevo guardián',
    short: 'Pequeño autómata de latón, curioso y silencioso.',
    long: 'Despierta entre engranajes detenidos sin más instrucciones que su propia curiosidad. No habla: observa, escucha el tic-tac del Gran Reloj y avanza. Cada Casa que recorre le devuelve una pieza de aquello que se rompió.',
  },
  {
    name: 'Almanaque XI',
    role: 'El guardián anterior',
    short: 'El almanaque anterior, relacionado con la ruptura del Gran Reloj.',
    long: 'Su rastro aparece en notas, mecanismos alterados y puertas que alguien cerró antes de tiempo. Nadie sabe con certeza qué hizo ni por qué, pero el Gran Reloj recuerda su nombre.',
  },
  {
    name: 'Ephemeris',
    role: 'La entidad que ordena',
    short: 'Entidad que guía y ordena a los Almanaques.',
    long: 'Antigua como las constelaciones que marcan las horas. Asigna a cada Almanaque su tarea y vela por el orden del tiempo. Observa a Almanaque XII en silencio, a la espera.',
  },
]

export const MECHANICS: { name: string; num: string; desc: string; chip: string; icon: IconName; frames: [number, number][] }[] = [
  { name: 'Salto', num: '01', desc: 'Movimiento básico.', chip: 'Movimiento', icon: 'automaton', frames: [[0, 0], [0, -14], [0, -7]] },
  { name: 'Ancla', num: '02', desc: 'Fija un punto temporal durante aproximadamente 6 segundos.', chip: '6 segundos', icon: 'anchor', frames: [[0, 0], [0, 8], [0, 4]] },
  { name: 'Gancho', num: '03', desc: 'Tiene 2 usos y se recarga al tocar suelo firme.', chip: '2 usos', icon: 'hook', frames: [[0, 0], [7, -7], [14, -14]] },
  { name: 'Escalar', num: '04', desc: 'Permite subir superficies determinadas durante aproximadamente 3 segundos.', chip: '3 segundos', icon: 'ladder', frames: [[0, 0], [0, -9], [0, -18]] },
]

export const COLLECTIONS: { title: string; icon: IconName; placeholder?: string }[] = [
  { title: 'Fragmentos de estrella', icon: 'star', placeholder: 'Documento pixel art' },
  { title: 'Poemas', icon: 'scroll' },
  { title: 'Notas de XI', icon: 'map' },
]

export const SOCIALS = ['Discord', 'YouTube', 'Instagram', 'X']
export const CREDITS = 'Créditos del equipo por anunciar · Dirección · Arte pixel · Música · Programación'
