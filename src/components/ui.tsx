import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

const flipH = (rows: string[]) => rows.map((r) => [...r].reverse().join(''))
const ARROW_R = ['...#...', '...##..', '######.', '#######', '######.', '...##..', '...#...']

/** Íconos pixel art: cada '#' es un pixel. */
export const ICONS = {
  image: ['#########', '#.......#', '#.##....#', '#.##....#', '#.....#.#', '#..#.####', '#.#######', '#########'],
  menu: ['#########', '.........', '#########', '.........', '#########'],
  close: ['#.....#', '##...##', '.##.##.', '..###..', '.##.##.', '##...##', '#.....#'],
  play: ['#....', '##...', '###..', '####.', '#####', '####.', '###..', '##...', '#....'],
  star: ['....#....', '....#....', '...###...', '#########', '.#######.', '..#####..', '..##.##..', '.##...##.', '.#.....#.'],
  lock: ['..###..', '.#...#.', '.#...#.', '#######', '#######', '###.###', '###.###', '#######', '#######'],
  gear: ['....#....', '.#.###.#.', '..#####..', '.##...##.', '###...###', '.##...##.', '..#####..', '.#.###.#.', '....#....'],
  hourglass: ['#######', '.#####.', '..###..', '...#...', '..#.#..', '.#...#.', '.#.#.#.', '.#####.', '#######'],
  scroll: ['.########', '#.#.....#', '.##.###.#', '..#.....#', '..#.###.#', '..#.....#', '..#######'],
  map: ['#########', '#..#..#.#', '#.#..#..#', '#..#.#.##', '#.#..##.#', '#..#..#.#', '#########'],
  arrowR: ARROW_R,
  arrowL: flipH(ARROW_R),
  arrowD: ['..###..', '..###..', '..###..', '#######', '.#####.', '..###..', '...#...'],
  plus: ['...#...', '...#...', '...#...', '#######', '...#...', '...#...', '...#...'],
  clock: ['..#####..', '.#.....#.', '#...#...#', '#...#...#', '#...##..#', '#.......#', '#.......#', '.#.....#.', '..#####..'],
  controller: ['.#########.', '###.####.##', '##...##.#.#', '###.####.##', '###########', '###.....###', '.#.......#.'],
  house: ['....#....', '...###...', '..#####..', '.#######.', '#########', '.###.###.', '.##...##.', '.##...##.'],
  social: ['#######', '#.....#', '#.###.#', '#.#.#.#', '#.###.#', '#.....#', '#######'],
} satisfies Record<string, string[]>

export type IconName = keyof typeof ICONS

const cache = new Map<IconName, { d: string; w: number; h: number }>()
function iconPath(name: IconName) {
  let hit = cache.get(name)
  if (!hit) {
    const rows = ICONS[name]
    let d = ''
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) if (r[x] === '#') d += `M${x} ${y}h1v1h-1z`
    })
    hit = { d, w: Math.max(...rows.map((r) => r.length)), h: rows.length }
    cache.set(name, hit)
  }
  return hit
}

export function Pix({ name, className = 'size-4', style }: { name: IconName; className?: string; style?: CSSProperties }) {
  const { d, w, h } = iconPath(name)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} style={style} fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  )
}

export function Corners({ all = false, out = false, className = '' }: { all?: boolean; out?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`${out ? 'corners-out' : ''} ${className}`}>
      <span className="corner corner-tl" />
      {all && <span className="corner corner-tr" />}
      {all && <span className="corner corner-bl" />}
      <span className="corner corner-br" />
    </span>
  )
}

type Ratio = '16/9' | '4/3' | '1/1' | '3/4'

/**
 * Espacio reservado para imagen. Para usar el recurso real, pasa `src`
 * (y `alt`): la proporción se mantiene y el layout no cambia.
 */
export function MediaSlot({
  ratio,
  label,
  src,
  alt,
  className = '',
  size = 'md',
  quiet = false,
}: {
  ratio: Ratio
  label: string
  src?: string
  alt?: string
  className?: string
  size?: 'sm' | 'md'
  quiet?: boolean
}) {
  return (
    <div className={`relative overflow-hidden border border-slate-700 bg-obsidian-900 ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <img src={src} alt={alt ?? label} loading="lazy" className="pixelated absolute inset-0 size-full object-cover" />
      ) : quiet ? (
        <div role="img" aria-label={`${alt ?? label}. Recurso oficial pendiente.`} className="absolute bottom-4 left-5 text-left">
          <span className="label-px block text-[0.625rem] text-cream-200/85">{label}</span>
          <span className="label-px block text-[0.5625rem] text-cream-200/60">Recurso oficial pendiente</span>
        </div>
      ) : (
        <div role="img" aria-label={`${alt ?? label}. Recurso oficial pendiente.`} className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
          <Pix name="image" className={size === 'sm' ? 'size-6 text-sand-300/70' : 'size-7 text-sand-300/80 md:size-9'} />
          <span className={`label-px text-cream-200/85 ${size === 'sm' ? 'text-[0.5rem]' : 'text-[0.625rem]'}`}>{label}</span>
          <span className={`label-px text-cream-200/60 ${size === 'sm' ? 'text-[0.4375rem]' : 'text-[0.5625rem]'}`}>Recurso oficial pendiente</span>
        </div>
      )}
      <Corners className="text-sand-300/50" />
    </div>
  )
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay * 90}ms` }}>
      {children}
    </div>
  )
}

export function SectionHeader({ label, title, titleId, subtitle }: { label: string; title: string; titleId: string; subtitle?: string }) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <p className="label-px flex items-center gap-3 text-[0.625rem] text-sand-300">
          <Pix name="star" className="size-3 text-ambar-400" />
          {label}
          <span aria-hidden="true" className="h-px w-16 bg-slate-700 md:w-28" />
        </p>
      </Reveal>
      <Reveal delay={1}>
        <h2 id={titleId} className="title-display mt-4 text-[clamp(2.4rem,5.5vw,4.25rem)]">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={2}>
          <p className="mt-3 text-lg text-white md:text-xl">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}

/** Mientras llega una respuesta de la API, o si falló, con un botón para reintentar. */
export function EstadoCarga({ error, onReintentar, className = '' }: { error?: string; onReintentar: () => void; className?: string }) {
  if (error)
    return (
      <div role="alert" className={`panel flex flex-col items-start gap-4 p-5 md:p-6 ${className}`}>
        <p className="label-px flex items-center gap-3 text-[0.625rem] text-ambar-400">
          <Pix name="clock" className="size-4" />
          Señal interrumpida
        </p>
        <p className="text-white">{error} Revisa tu conexión e inténtalo de nuevo.</p>
        <button type="button" className="btn btn-ghost" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    )
  return (
    <div role="status" className={`panel flex items-center gap-4 p-5 md:p-6 ${className}`}>
      <Pix name="gear" className="spin-steps size-6 shrink-0 text-terracotta-500" />
      <p className="label-px text-[0.625rem] text-sand-300">Consultando el Gran Reloj…</p>
    </div>
  )
}

/** Ventana modal: atrapa el foco, se cierra con Escape o al tocar fuera y devuelve el foco al salir. */
export function Dialogo({ tituloId, onClose, className = '', children }: { tituloId: string; onClose: () => void; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    document.body.style.overflow = 'hidden'
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
    }
    addEventListener('keydown', k)
    return () => {
      removeEventListener('keydown', k)
      document.body.style.overflow = ''
      prev?.focus({ preventScroll: true })
    }
  }, [])
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`panel fade-steps relative max-h-[90svh] w-full overflow-y-auto p-5 outline-none md:p-8 ${className}`}
      >
        <button type="button" className="btn btn-ghost absolute right-3 top-3 z-10 !px-3" aria-label="Cerrar" onClick={onClose}>
          <Pix name="close" className="size-3.5" />
        </button>
        {children}
      </div>
    </div>
  )
}

/** Astrolabio / engranaje decorativo. */
export function Astrolabe({ className = '' }: { className?: string }) {
  const teeth = 36
  const pts: string[] = []
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2
    const a1 = a0 + Math.PI / teeth
    const corners: [number, number][] = [[44, a0], [48, a0], [48, a1], [44, a1]]
    for (const [r, a] of corners) pts.push(`${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`)
  }
  return (
    <svg viewBox="-50 -50 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="0.45" aria-hidden="true">
      <polygon points={pts.join(' ')} />
      <circle r="40" strokeDasharray="1 1.4" />
      <circle r="31" />
      <circle r="22" strokeDasharray="0.6 1" />
      <circle r="7" />
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2
        const r0 = i % 4 === 0 ? 33 : 35
        return <line key={i} x1={r0 * Math.cos(a)} y1={r0 * Math.sin(a)} x2={38 * Math.cos(a)} y2={38 * Math.sin(a)} />
      })}
      <ellipse rx="31" ry="13" transform="rotate(24)" />
      <ellipse rx="31" ry="13" transform="rotate(-36)" strokeDasharray="1 1" />
      <line x1="-40" y1="0" x2="40" y2="0" />
      <line x1="0" y1="-40" x2="0" y2="40" />
      <polygon points="0,-18 3,-3 18,0 3,3 0,18 -3,3 -18,0 -3,-3" />
    </svg>
  )
}
