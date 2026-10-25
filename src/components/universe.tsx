import { useEffect, useRef, useState } from 'react'
import { CHARACTERS, COLLECTIONS, CREDITS, HOUSES, MECHANICS, SECTIONS, SOCIALS, type House } from '../content'
import { prefersReducedMotion, scrollToId } from '../lib'
import { Corners, MediaSlot, Pix, Reveal, SectionHeader } from './ui'

const OCTAGON = '30,4 70,4 70,10 82,10 82,18 90,18 90,30 96,30 96,70 90,70 90,82 82,82 82,90 70,90 70,96 30,96 30,90 18,90 18,82 10,82 10,70 4,70 4,30 10,30 10,18 18,18 18,10 30,10'

export function World() {
  const [sel, setSel] = useState('geminis')
  const [hover, setHover] = useState<string | null>(null)
  const fichaRef = useRef<HTMLDivElement>(null)
  const house = HOUSES.find((h) => h.id === sel) ?? HOUSES[2]
  const openHouses = HOUSES.filter((h) => !h.locked)
  const hovered = HOUSES.find((h) => h.id === hover)

  const choose = (id: string) => {
    setSel(id)
    if (innerWidth < 1024) setTimeout(() => fichaRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' }), 30)
  }

  return (
    <section id="mundo" aria-labelledby="mundo-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeader label="Registro 03 · Cartografía" title="El Gran Reloj" titleId="mundo-title" subtitle="Seis lugares. Un mismo mecanismo." />
        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-2 lg:items-start lg:gap-10">
          <Reveal>
            <div className="panel p-4 md:p-6">
              <div className="label-px flex justify-between gap-3 text-[0.5625rem] text-cream-200/75 md:text-[0.625rem]">
                <span>Mapa del cosmos</span>
                <span aria-live="polite">{hovered ? (hovered.locked ? `Loc. ${hovered.loc} · Por revelar` : hovered.name) : 'Gran Reloj Cósmico'}</span>
              </div>
              <div className="relative mx-auto mt-4 aspect-square w-full max-w-[520px]">
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
                  <polygon points={OCTAGON} stroke="var(--slate-700)" strokeWidth="0.6" fill="rgb(11 21 30 / 0.5)" />
                  <polygon points={OCTAGON} stroke="var(--slate-700)" strokeWidth="0.35" strokeDasharray="1 1" transform="translate(7 7) scale(0.86)" />
                  <rect x="30" y="30" width="40" height="40" stroke="var(--slate-700)" strokeWidth="0.4" strokeDasharray="1.5 1" />
                  <rect x="39" y="39" width="22" height="22" stroke="var(--slate-700)" strokeWidth="0.4" strokeDasharray="0.5 1" />
                  {HOUSES.map((h) => {
                    const on = h.id === sel || h.id === hover
                    return <line key={h.id} x1="50" y1="50" x2={h.pos.x} y2={h.pos.y} stroke={on ? 'var(--ambar-400)' : 'var(--slate-700)'} strokeWidth={on ? 0.6 : 0.4} strokeDasharray="1.2 1" />
                  })}
                </svg>
                <div className="absolute left-1/2 top-1/2 flex size-[13%] -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-slate-700 bg-bg" aria-hidden="true">
                  <Pix name="clock" className="w-1/2 text-terracotta-500" />
                </div>
                {HOUSES.map((h) => (
                  <MapMarker key={h.id} h={h} active={h.id === sel} onPick={() => choose(h.id)} onHover={(v) => setHover(v ? h.id : null)} />
                ))}
              </div>
              <p className="label-px mt-4 text-center text-[0.5625rem] text-sand-300 md:text-[0.625rem]">Toca un marcador para explorar</p>
            </div>
          </Reveal>

          <div ref={fichaRef} className="scroll-mt-24">
            <div role="tablist" aria-label="Casas reveladas" className="grid grid-cols-2">
              {openHouses.map((h) => {
                const active = h.id === sel
                return (
                  <button
                    key={h.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    aria-controls="ficha-casa"
                    onClick={() => setSel(h.id)}
                    className={`label-px border-2 py-3 text-[0.6875rem] transition-colors ${active ? 'border-ambar-400 bg-ambar-400 text-bg' : 'border-slate-700 bg-slate-700 text-cream-200 hover:bg-slate-800'}`}
                  >
                    {h.short}
                  </button>
                )
              })}
            </div>
            <div id="ficha-casa" role="tabpanel" aria-live="polite" key={house.id} className="panel fade-steps mt-4 p-5 md:p-7">
              <HouseCard h={house} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MapMarker({ h, active, onPick, onHover }: { h: House; active: boolean; onPick: () => void; onHover: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-pressed={active}
      aria-label={h.locked ? `Localización ${h.loc}: casa por revelar` : `${h.name}, localización ${h.loc}`}
      style={{ left: `${h.pos.x}%`, top: `${h.pos.y}%` }}
      className={`group absolute flex size-[13%] -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 transition-colors ${
        active ? 'border-ambar-400 bg-muted-purple-600' : 'border-slate-700 bg-bg hover:border-ambar-400 hover:bg-slate-800'
      }`}
    >
      {h.locked ? (
        <Pix name="lock" className={`w-[36%] ${active ? 'text-ambar-400' : 'text-muted-purple-600 group-hover:text-sand-300'}`} />
      ) : (
        <Pix
          name="star"
          className={`w-1/2 transition-[color,filter] ${
            active ? 'text-ambar-400 [filter:drop-shadow(0_0_6px_rgb(255_170_94/0.9))]' : 'text-sand-300/70 group-hover:text-ambar-400 group-hover:[filter:drop-shadow(0_0_6px_rgb(255_170_94/0.9))]'
          }`}
        />
      )}
      <span className="label-px absolute bottom-0 right-0.5 text-[0.5rem] tracking-normal text-cream-200/70">{h.loc}</span>
      {h.locked && (
        <span className="label-px pointer-events-none absolute left-1/2 top-[calc(100%+4px)] hidden -translate-x-1/2 whitespace-nowrap text-[0.5rem] text-cream-200/60 sm:block">Por revelar</span>
      )}
    </button>
  )
}

function HouseCard({ h }: { h: House }) {
  if (h.locked)
    return (
      <div className="flex flex-col items-start">
        <p className="label-px text-[0.625rem] text-sand-300">Localización {h.loc}</p>
        <h3 className="title-display mt-2 text-[clamp(1.9rem,3.6vw,2.75rem)]">Por revelar</h3>
        <div className="mt-6 flex aspect-video w-full items-center justify-center border border-dashed border-slate-700 bg-bg">
          <Pix name="lock" className="size-12 text-muted-purple-600" />
        </div>
        <p className="mt-5 text-cream-200/90">Esta Casa permanece sellada. Sus habitaciones se revelarán cuando el Gran Reloj lo permita. Cada secreto, a su tiempo.</p>
      </div>
    )
  return (
    <div>
      <p className="label-px text-[0.625rem] text-sand-300">Localización {h.loc}</p>
      <h3 className="label-px mt-2 text-sm text-cream-200">{h.name}</h3>
      <p className="title-display mt-1 text-[clamp(1.9rem,3.6vw,2.75rem)]">{h.epithet}</p>
      <MediaSlot ratio="16/9" label={h.name} className="mt-5" />
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Características">
        {h.chips.map((c) => (
          <li key={c} className="chip">
            {c}
          </li>
        ))}
      </ul>
      <p className="label-px mt-7 flex items-center gap-3 text-[0.625rem] text-sand-300">
        Habitaciones / 0{h.rooms.length}
        <span aria-hidden="true" className="h-px flex-1 bg-slate-700" />
      </p>
      <ol className="mt-2">
        {h.rooms.map((r, i) => (
          <li key={r} className="flex items-baseline gap-4 border-b border-slate-700 py-3">
            <span className="label-px text-[0.625rem] text-ambar-400">0{i + 1}</span>
            <span className="text-cream-200">{r}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Characters() {
  const track = useRef<HTMLUListElement>(null)
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = () => {
    const el = track.current
    if (!el) return
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }
  useEffect(() => {
    update()
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [])
  const by = (dir: number) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * (card ? card.getBoundingClientRect().width + 24 : el.clientWidth), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section id="personajes" aria-labelledby="personajes-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader label="Registro 04 · Habitantes" title="Personajes" titleId="personajes-title" subtitle="Quienes habitan entre los engranajes." />
          <div className="flex gap-3">
            <button type="button" className="btn btn-ghost !px-3 disabled:opacity-40" aria-label="Personaje anterior" disabled={edges.start} onClick={() => by(-1)}>
              <Pix name="arrowL" className="size-4" />
            </button>
            <button type="button" className="btn btn-ghost !px-3 disabled:opacity-40" aria-label="Personaje siguiente" disabled={edges.end} onClick={() => by(1)}>
              <Pix name="arrowR" className="size-4" />
            </button>
          </div>
        </div>
        <ul ref={track} onScroll={update} aria-label="Carrusel de personajes" className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:scroll-px-0 md:px-0">
          {CHARACTERS.map((c, i) => (
            <li key={c.name} className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
              <Reveal delay={i} className="h-full">
                <article className="panel group flex h-full flex-col p-4 md:p-5">
                  <p className="label-px text-[0.625rem] text-sand-300">Personaje 0{i + 1}</p>
                  <MediaSlot ratio="3/4" label="Ilustración del personaje" alt={`Retrato de ${c.name}`} className="mt-3" />
                  <h3 className="mt-5 font-display text-2xl uppercase text-terracotta-500 md:text-3xl">{c.name}</h3>
                  <p className="mt-2 flex-1 text-cream-200/90">{c.short}</p>
                  <button type="button" aria-haspopup="dialog" onClick={() => setOpenIdx(i)} className="label-px mt-5 flex items-center justify-between border-t border-slate-700 pt-4 text-[0.6875rem] text-ambar-400 hover:text-sand-300">
                    <span>
                      Ver más <span className="sr-only">sobre {c.name}</span>
                    </span>
                    <Pix name="arrowR" className="size-3.5 transition-transform [transition-timing-function:steps(2)] group-hover:translate-x-1" />
                  </button>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
      {openIdx !== null && <CharacterModal index={openIdx} onClose={() => setOpenIdx(null)} />}
    </section>
  )
}

function CharacterModal({ index, onClose }: { index: number; onClose: () => void }) {
  const c = CHARACTERS[index]
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
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="panel fade-steps relative grid max-h-[90svh] w-full max-w-3xl gap-6 overflow-y-auto p-5 outline-none md:grid-cols-[220px_1fr] md:p-8"
      >
        <button type="button" className="btn btn-ghost absolute right-3 top-3 z-10 !px-3" aria-label="Cerrar" onClick={onClose}>
          <Pix name="close" className="size-3.5" />
        </button>
        <MediaSlot ratio="3/4" label="Ilustración del personaje" alt={`Retrato de ${c.name}`} className="w-40 md:w-full" />
        <div>
          <p className="label-px text-[0.625rem] text-sand-300">
            Personaje 0{index + 1} · {c.role}
          </p>
          <h3 id="modal-title" className="title-display mt-3 text-4xl">
            {c.name}
          </h3>
          <p className="mt-4 text-lg text-sand-300">{c.short}</p>
          <p className="mt-4 text-cream-200/90">{c.long}</p>
          <p className="label-px mt-6 text-[0.5625rem] text-cream-200/60">Texto provisional · Registro en revisión</p>
        </div>
      </div>
    </div>
  )
}

export function Mechanics() {
  return (
    <section id="mecanicas" aria-labelledby="mecanicas-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeader label="Registro 05 · Habilidades" title="Mecánicas" titleId="mecanicas-title" subtitle="Manual de campo de Almanaque XII." />
        <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
          {MECHANICS.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={i} className="h-full">
                <article tabIndex={0} className="panel group flex h-full gap-5 p-5 transition-colors hover:bg-slate-800 focus-visible:bg-slate-800 md:p-6">
                  <div role="img" aria-label={`Ícono de ${m.name}. Recurso oficial pendiente.`} className="relative aspect-square w-20 shrink-0 border border-slate-700 bg-bg md:w-24">
                    <div className="absolute inset-0 m-auto size-[52%] overflow-hidden">
                      <div className="sprite-strip">
                        {m.frames.map(([dx, dy], f) => (
                          <div key={f} className="flex h-full w-1/3 items-center justify-center">
                            <Pix name={m.icon} className="size-full text-terracotta-500" style={{ transform: `translate(${dx}%, ${dy}%)` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <Corners className="text-slate-700 [&_.corner]:size-2 [&_.corner-br]:bottom-1 [&_.corner-br]:right-1 [&_.corner-tl]:left-1 [&_.corner-tl]:top-1" />
                  </div>
                  <div>
                    <h3 className="flex items-baseline gap-3">
                      <span className="font-display text-2xl uppercase text-terracotta-500 md:text-3xl">{m.name}</span>
                      <span className="label-px text-[0.625rem] text-sand-300">{m.num}</span>
                    </h3>
                    <p className="mt-2 text-cream-200/90">{m.desc}</p>
                    <span className="chip label-px mt-4 !text-[0.625rem]">{m.chip}</span>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Archives() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true })
  return (
    <section id="archivos" aria-labelledby="archivos-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeader label="Registro 06 · Colecciones" title="Archivos" titleId="archivos-title" subtitle="Vestigios de un tiempo que permanece." />
        <ul className="mt-12 max-w-4xl space-y-4 md:mt-16">
          {COLLECTIONS.map((c, i) => {
            const isOpen = !!open[i]
            return (
              <li key={c.title}>
                <Reveal delay={i}>
                  <div className="panel">
                    <h3>
                      <button
                        type="button"
                        id={`col-h-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`col-p-${i}`}
                        onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-slate-800 md:gap-6 md:p-5"
                      >
                        <span className="flex size-12 shrink-0 items-center justify-center border border-slate-700 bg-bg">
                          <Pix name={c.icon} className="size-5 text-terracotta-500" />
                        </span>
                        <span className="flex-1">
                          <span className="label-px block text-[0.625rem] text-sand-300">Colección 0{i + 1}</span>
                          <span className="mt-1 block font-display text-xl uppercase text-terracotta-500 md:text-2xl">{c.title}</span>
                        </span>
                        <Pix name="plus" className={`size-4 text-ambar-400 transition-transform duration-300 [transition-timing-function:steps(3)] ${isOpen ? 'rotate-45' : ''}`} />
                      </button>
                    </h3>
                    <div
                      id={`col-p-${i}`}
                      role="region"
                      aria-labelledby={`col-h-${i}`}
                      inert={!isOpen}
                      className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-slate-700 p-4 md:p-6">
                          {c.placeholder && <MediaSlot ratio="16/9" label={c.placeholder} className="mb-5 max-w-xl" />}
                          <p className="text-cream-200/90">Espacio preparado para los registros oficiales de esta colección.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative border-t border-slate-700 bg-black/50 pb-10 pt-16">
      <div className="wrap grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="logo text-xl md:text-2xl">ASTROLABIO</p>
          <p className="mt-5 font-display text-2xl uppercase text-sand-300">Cada secreto, a su tiempo.</p>
          <Pix name="gear" className="spin-steps mt-6 size-8 text-terracotta-500" />
        </div>
        <nav aria-label="Secciones del pie">
          <p className="label-px text-[0.625rem] text-sand-300">Índice</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(s.id)
                  }}
                  className="text-cream-200 underline-offset-4 hover:text-ambar-400 hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label-px text-[0.625rem] text-sand-300">Señales</p>
          <ul className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <li key={s}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={`${s} (enlace pendiente)`}
                  className="flex size-10 items-center justify-center border border-slate-700 bg-obsidian-900 text-sand-300 shadow-[3px_3px_0_#000] transition-[transform,box-shadow] [transition-timing-function:steps(2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:text-ambar-400 hover:shadow-[1px_1px_0_#000]"
                >
                  <Pix name="social" className="size-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-cream-200/80">{CREDITS}</p>
        </div>
      </div>
      <div className="wrap label-px mt-14 flex flex-wrap justify-between gap-3 border-t border-slate-700 pt-6 text-[0.5625rem] text-cream-200/65">
        <span>© {new Date().getFullYear()} ASTROLABIO</span>
        <span>Sitio informativo · Contenido provisional</span>
      </div>
    </footer>
  )
}
