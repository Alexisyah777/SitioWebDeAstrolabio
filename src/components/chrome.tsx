import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { SECTIONS } from '../content'
import { playTrailer, prefersReducedMotion, scrollToId, seeded } from '../lib'
import { Astrolabe, MediaSlot, Pix, type IconName } from './ui'

export function Starfield() {
  const layers = useMemo(() => {
    const r = seeded(7)
    return [
      { depth: 6, n: 80, s: 2 },
      { depth: 14, n: 40, s: 3 },
      { depth: 26, n: 14, s: 4 },
    ].map((l) => ({
      ...l,
      stars: Array.from({ length: l.n }, () => ({
        x: r() * 100,
        y: r() * 100,
        d: 2 + r() * 5,
        delay: r() * 6,
        c: r() > 0.85 ? 'var(--ambar-400)' : r() > 0.5 ? 'var(--sand-300)' : 'var(--cream-200)',
      })),
    }))
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const on = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = document.documentElement.scrollHeight - innerHeight
        document.documentElement.style.setProperty('--sp', String(max > 0 ? scrollY / max : 0))
      })
    }
    on()
    addEventListener('scroll', on, { passive: true })
    return () => {
      removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -right-[30vmax] top-[10vh] w-[100vmax] text-sand-300 opacity-[0.06]" style={{ transform: 'translate3d(0, calc(var(--sp, 0) * -12vh), 0)' }}>
        <Astrolabe className="spin-slower w-full" />
      </div>
      {layers.map((l, i) => (
        <div key={i} className="absolute inset-x-0 top-0 h-[140vh]" style={{ transform: `translate3d(0, calc(var(--sp, 0) * -${l.depth}vh), 0)` }}>
          {l.stars.map((s, j) => (
            <span key={j} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: l.s, height: l.s, background: s.c, animationDuration: `${s.d}s`, animationDelay: `-${s.delay}s` }} />
          ))}
        </div>
      ))}
      <svg className="absolute inset-0 size-full text-sand-300 opacity-[0.16]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
        {['8,22 15,18 22,24 28,20 33,27', '70,12 76,18 74,26 82,30 88,24', '12,72 18,66 26,70 24,80', '62,78 70,74 78,80 86,76 90,84'].map((p) => (
          <g key={p}>
            <polyline points={p} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 4" />
            {p.split(' ').map((pt) => {
              const [x, y] = pt.split(',').map(Number)
              return <rect key={pt} x={x - 0.3} y={y - 0.3} width="0.6" height="0.6" fill="currentColor" stroke="none" />
            })}
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.55)_100%)]" />
    </div>
  )
}

export function Loader({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const reduce = prefersReducedMotion()
    document.body.style.overflow = 'hidden'
    const id = setInterval(() => setP((v) => Math.min(100, v + (reduce ? 34 : 6 + Math.random() * 9))), 110)
    return () => {
      clearInterval(id)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (p < 100) return
    const a = setTimeout(() => setLeaving(true), 300)
    const b = setTimeout(() => done.current(), 900)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [p])

  const filled = Math.round(p / 5)
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando ASTROLABIO"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-bg px-6 transition-opacity duration-500 ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <p className="logo text-2xl md:text-4xl">ASTROLABIO</p>
      <MediaSlot ratio="1/1" label="Personaje principal" size="sm" className="w-36 md:w-44" />
      <div className="w-full max-w-xs">
        <div className="label-px flex justify-between text-[0.625rem] text-sand-300">
          <span>
            Cargando<span className="animate-[blink_1s_steps(1)_infinite]">_</span>
          </span>
          <span>{Math.round(p)}%</span>
        </div>
        <div className="mt-2 flex gap-[3px] border-2 border-slate-700 bg-obsidian-900 p-[3px]">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className={`h-3 flex-1 ${i < filled ? 'bg-ambar-400' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Navbar({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const on = () => setCompact(scrollY > 24)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,padding,border-color] duration-300 ${
        compact ? 'border-slate-700/70 bg-bg/80 py-2.5 backdrop-blur-md' : 'border-transparent py-4 md:py-6'
      }`}
    >
      <nav aria-label="Principal" className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10">
        <a
          href="#inicio"
          aria-label="ASTROLABIO, volver al inicio"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('inicio')
          }}
          className={`logo transition-[font-size] duration-300 ${compact ? 'text-sm md:text-base' : 'text-sm md:text-xl'}`}
        >
          ASTROLABIO
        </a>
        <div className="flex items-center gap-3">
          <button type="button" className="btn btn-primary hidden sm:inline-flex" onClick={playTrailer}>
            <Pix name="play" className="h-3 w-2" />
            Ver tráiler
          </button>
          <button type="button" className="btn btn-ghost" aria-expanded={menuOpen} aria-controls="menu-overlay" onClick={onMenu}>
            <Pix name="menu" className="h-3 w-4" />
            Menú
          </button>
        </div>
      </nav>
    </header>
  )
}

const SPRITES: { icon: IconName; style: CSSProperties; depth: number; dur: number }[] = [
  { icon: 'hourglass', style: { top: '16%', right: '7%' }, depth: 18, dur: 1.4 },
  { icon: 'gear', style: { top: '40%', right: '3%' }, depth: 32, dur: 1.9 },
  { icon: 'star', style: { top: '64%', right: '11%' }, depth: 12, dur: 1.1 },
  { icon: 'scroll', style: { bottom: '7%', right: '26%' }, depth: 26, dur: 1.7 },
  { icon: 'map', style: { top: '26%', right: '24%' }, depth: 16, dur: 2.1 },
]

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const blocks = useMemo(() => {
    const r = seeded(42)
    return Array.from({ length: 96 }, () => Math.round(r() * 320))
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => rootRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 380)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'Tab' && rootRef.current) {
        const f = rootRef.current.querySelectorAll<HTMLElement>('a[href], button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus({ preventScroll: true })
    }
  }, [open])

  if (!open) return null

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    onClose()
    setTimeout(() => scrollToId(id), 40)
  }

  return (
    <div
      ref={rootRef}
      id="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de secciones"
      className="fixed inset-0 z-50"
      onMouseMove={(e) => {
        const el = rootRef.current
        if (!el) return
        el.style.setProperty('--mx', String((e.clientX / innerWidth) * 2 - 1))
        el.style.setProperty('--my', String((e.clientY / innerHeight) * 2 - 1))
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-12 grid-rows-8">
        {blocks.map((d, i) => (
          <span key={i} className="px-block bg-bg" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
      <div className="fade-steps absolute inset-0 flex flex-col" style={{ animationDelay: '340ms' }}>
        <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-5">
          <span className="logo text-sm md:text-xl">ASTROLABIO</span>
          <span className="label-px hidden text-[0.625rem] text-sand-300 md:block">Índice del Gran Reloj · 07 secciones</span>
          <button type="button" className="btn btn-ghost !px-3" aria-label="Cerrar menú" onClick={onClose}>
            <Pix name="close" className="size-4" />
          </button>
        </div>
        <nav aria-label="Secciones" className="flex min-h-0 flex-1 flex-col">
          <ul className="flex min-h-0 flex-1 flex-col">
            {SECTIONS.map((s, i) => (
              <li key={s.id} className="menu-stripe flex min-h-0 flex-1" style={{ animationDelay: `${380 + i * 45}ms` }}>
                <a
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  data-autofocus={i === 0 ? '' : undefined}
                  className={`group flex w-full items-center gap-4 overflow-hidden border-t border-slate-700 px-5 transition-colors duration-150 hover:bg-ambar-400 focus-visible:bg-ambar-400 focus-visible:outline-none md:gap-8 md:px-10 ${
                    i % 2 === 0 ? 'bg-obsidian-900' : 'bg-bg'
                  }`}
                >
                  <span className="label-px w-8 shrink-0 text-[0.625rem] text-sand-300 group-hover:text-bg group-focus-visible:text-bg">0{i + 1}</span>
                  <span
                    className="font-display uppercase leading-none text-terracotta-500 transition-transform duration-200 [transition-timing-function:steps(4)] group-hover:translate-x-4 group-hover:text-bg group-focus-visible:translate-x-4 group-focus-visible:text-bg md:group-hover:translate-x-10"
                    style={{ fontSize: 'clamp(1.6rem, min(9vw, 8vh), 6.5rem)' }}
                  >
                    {s.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {SPRITES.map((sp) => (
        <div
          key={sp.icon}
          aria-hidden="true"
          className="pointer-events-none absolute z-10 hidden transition-transform duration-300 ease-out md:block"
          style={{ ...sp.style, transform: `translate(calc(var(--mx, 0) * ${sp.depth}px), calc(var(--my, 0) * ${sp.depth}px))` }}
        >
          <span className="bob block [filter:drop-shadow(2px_2px_0_#000)]" style={{ animationDuration: `${sp.dur}s` }}>
            <Pix name={sp.icon} className="size-9 text-sand-300 lg:size-11" />
          </span>
        </div>
      ))}
    </div>
  )
}

export function ClockIndicator() {
  const [state, setState] = useState({ rot: 0, active: 0 })
  useEffect(() => {
    let raf = 0
    const calc = () => {
      raf = 0
      const probe = scrollY + innerHeight * 0.4
      const tops = SECTIONS.map((s) => {
        const el = document.getElementById(s.id)
        return el ? el.getBoundingClientRect().top + scrollY : 0
      })
      let i = 0
      tops.forEach((t, k) => {
        if (probe >= t) i = k
      })
      let frac = i < tops.length - 1 ? Math.min(1, Math.max(0, (probe - tops[i]) / (tops[i + 1] - tops[i]))) : 0
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) {
        i = tops.length - 1
        frac = 0
      }
      setState({ rot: ((i + frac) * 360) / SECTIONS.length, active: i })
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc)
    }
    calc()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav aria-label="Manecilla del Gran Reloj" className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <div className="relative size-28">
        <svg viewBox="0 0 112 112" className="absolute inset-0 size-full" aria-hidden="true">
          <circle cx="56" cy="56" r="54" fill="rgb(13 43 69 / 0.85)" stroke="var(--slate-700)" strokeWidth="2" />
          <circle cx="56" cy="56" r="36" fill="none" stroke="var(--slate-700)" strokeDasharray="2 3" />
          {Array.from({ length: 28 }, (_, i) => {
            const a = (i / 28) * Math.PI * 2
            return <rect key={i} x={56 + 30 * Math.cos(a) - 0.75} y={56 + 30 * Math.sin(a) - 0.75} width="1.5" height="1.5" fill="var(--muted-purple-600)" />
          })}
          <g style={{ transform: `rotate(${state.rot}deg)`, transformOrigin: '56px 56px', transition: 'transform .25s linear' }}>
            <rect x="55" y="22" width="2" height="34" fill="var(--ambar-400)" />
            <rect x="53" y="18" width="6" height="6" fill="var(--ambar-400)" />
          </g>
          <rect x="52" y="52" width="8" height="8" fill="var(--terracotta-500)" stroke="var(--bg)" strokeWidth="1" />
        </svg>
        {SECTIONS.map((s, i) => {
          const a = (i / SECTIONS.length) * Math.PI * 2 - Math.PI / 2
          const active = state.active === i
          return (
            <button
              key={s.id}
              type="button"
              aria-label={`Ir a ${s.label}`}
              aria-current={active ? 'location' : undefined}
              onClick={() => scrollToId(s.id)}
              className="group absolute size-3 -translate-x-1/2 -translate-y-1/2"
              style={{ left: 56 + 46 * Math.cos(a), top: 56 + 46 * Math.sin(a) }}
            >
              <span className={`block size-full border-2 transition-colors ${active ? 'border-ambar-400 bg-ambar-400' : 'border-sand-300/70 bg-bg group-hover:bg-sand-300'}`} />
              <span className="label-px pointer-events-none absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap border border-slate-700 bg-bg px-2 py-1 text-[0.625rem] text-sand-300 opacity-0 transition-opacity [transition-timing-function:steps(2)] group-hover:opacity-100 group-focus-visible:opacity-100">
                {String(i + 1).padStart(2, '0')} · {s.label}
              </span>
            </button>
          )
        })}
      </div>
      <p className="label-px mt-3 text-center text-[0.5625rem] text-ambar-400" aria-hidden="true">
        {SECTIONS[state.active].label}
      </p>
    </nav>
  )
}
