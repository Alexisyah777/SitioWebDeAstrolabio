import { useEffect, useRef, useState } from 'react'
import {
  useApi,
  type Archivo,
  type CategoriaArchivo,
  type Mecanicas,
  type Personaje,
  type PersonajeResumen,
} from '../api'
import { CREDITS, SECTIONS, SOCIALS } from '../content'
import { prefersReducedMotion, scrollToId } from '../lib'
import { Dialogo, EstadoCarga, MediaSlot, Pix, Reveal, SectionHeader, type IconName } from './ui'

const dos = (n: number) => String(n).padStart(2, '0')

const ROLES: Record<string, string> = { protagonista: 'Protagonista', guia: 'Guía', secundario: 'Secundario' }
const rol = (r: string) => ROLES[r] ?? r.charAt(0).toUpperCase() + r.slice(1)

export function Characters() {
  const { datos: personajes, error, reintentar } = useApi<PersonajeResumen[]>('/personajes')
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
  useEffect(update, [personajes])
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
            <button type="button" className="btn btn-ghost !px-3 disabled:opacity-40" aria-label="Personaje anterior" disabled={!personajes || edges.start} onClick={() => by(-1)}>
              <Pix name="arrowL" className="size-4" />
            </button>
            <button type="button" className="btn btn-ghost !px-3 disabled:opacity-40" aria-label="Personaje siguiente" disabled={!personajes || edges.end} onClick={() => by(1)}>
              <Pix name="arrowR" className="size-4" />
            </button>
          </div>
        </div>
        {!personajes ? (
          <EstadoCarga error={error} onReintentar={reintentar} className="mt-12" />
        ) : (
          <ul ref={track} onScroll={update} aria-label="Carrusel de personajes" className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:scroll-px-0 md:px-0">
            {personajes.map((c, i) => (
              <li key={c.slug} className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                <Reveal delay={i} className="h-full">
                  <article className="panel group flex h-full flex-col p-4 md:p-5">
                    <p className="label-px text-[0.625rem] text-sand-300">
                      Personaje {dos(i + 1)} · {rol(c.rol)}
                    </p>
                    <MediaSlot ratio="3/4" label="Ilustración del personaje" src={c.imagenUrl ?? undefined} alt={`Retrato de ${c.nombre}`} className="mt-3" />
                    <h3 className="mt-5 font-display text-2xl uppercase text-terracotta-500 md:text-3xl">{c.nombre}</h3>
                    <p className="mt-2 flex-1 text-white">{c.resumen}</p>
                    <button type="button" aria-haspopup="dialog" onClick={() => setOpenIdx(i)} className="label-px mt-5 flex items-center justify-between border-t border-slate-700 pt-4 text-[0.6875rem] text-ambar-400 hover:text-sand-300">
                      <span>
                        Ver más <span className="sr-only">sobre {c.nombre}</span>
                      </span>
                      <Pix name="arrowR" className="size-3.5 transition-transform [transition-timing-function:steps(2)] group-hover:translate-x-1" />
                    </button>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
      {personajes && openIdx !== null && <CharacterModal resumen={personajes[openIdx]} index={openIdx} onClose={() => setOpenIdx(null)} />}
    </section>
  )
}

const CAMPOS_PERSONAJE = [
  ['origen', 'Origen'],
  ['motivacion', 'Motivación'],
  ['personalidad', 'Personalidad'],
  ['arco', 'Arco'],
] as const

const CATEGORIAS_RASGO: Record<string, string> = {
  apariencia: 'Apariencia',
  expresion: 'Expresión',
  herramienta: 'Herramienta',
  comunicacion: 'Comunicación',
  presencia: 'Presencia',
}

function CharacterModal({ resumen, index, onClose }: { resumen: PersonajeResumen; index: number; onClose: () => void }) {
  const { datos: c, error, reintentar } = useApi<Personaje>(`/personajes/${resumen.slug}`)
  return (
    <Dialogo tituloId="modal-title" onClose={onClose} className="grid max-w-3xl gap-6 md:grid-cols-[220px_1fr]">
      <MediaSlot ratio="3/4" label="Ilustración del personaje" src={resumen.imagenUrl ?? undefined} alt={`Retrato de ${resumen.nombre}`} className="w-40 md:w-full" />
      <div>
        <p className="label-px text-[0.625rem] text-sand-300">
          Personaje {dos(index + 1)} · {rol(resumen.rol)}
        </p>
        <h3 id="modal-title" className="title-display mt-3 text-4xl">
          {resumen.nombre}
        </h3>
        {c?.titulo && <p className="label-px mt-3 text-[0.6875rem] text-ambar-400">{c.titulo}</p>}
        <p className="mt-4 text-lg text-white">{resumen.resumen}</p>
        {!c ? (
          <EstadoCarga error={error} onReintentar={reintentar} className="mt-6" />
        ) : (
          <>
            <dl>
              {CAMPOS_PERSONAJE.map(([campo, titulo]) =>
                c[campo] ? (
                  <div key={campo} className="mt-5">
                    <dt className="label-px text-[0.625rem] text-sand-300">{titulo}</dt>
                    <dd className="mt-1 text-white">{c[campo]}</dd>
                  </div>
                ) : null,
              )}
            </dl>
            {Object.entries(c.rasgos).map(([categoria, rasgos]) => (
              <div key={categoria} className="mt-6 border-t border-slate-700 pt-4">
                <p className="label-px text-[0.625rem] text-sand-300">{CATEGORIAS_RASGO[categoria] ?? categoria}</p>
                <ul className="mt-2 space-y-2">
                  {rasgos.map((r) => (
                    <li key={r.nombre} className="text-white">
                      <span className="text-cream-200">{r.nombre}</span>
                      {r.descripcion && <>: {r.descripcion}</>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </Dialogo>
  )
}

export function Mechanics() {
  const { datos, error, reintentar } = useApi<Mecanicas>('/mecanicas')
  const mecanicas = datos?.habilidades.filter((h) => h.tipo === 'mecanica') ?? []
  const acciones = datos?.habilidades.filter((h) => h.tipo !== 'mecanica') ?? []
  return (
    <section id="mecanicas" aria-labelledby="mecanicas-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeader label="Registro 05 · Habilidades" title="Mecánicas" titleId="mecanicas-title" subtitle="Manual de campo de Almanaque XII." />
        {!datos ? (
          <EstadoCarga error={error} onReintentar={reintentar} className="mt-12 md:mt-16" />
        ) : (
          <>
            <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
              {mecanicas.map((m, i) => (
                <li key={m.slug}>
                  <Reveal delay={i} className="h-full">
                    <article className="panel flex h-full gap-5 p-5 md:p-6">
                      {/* Recurso visual de la mecánica (iconoUrl en la base de datos) */}
                      <div aria-hidden="true" className="relative aspect-square w-20 shrink-0 overflow-hidden border border-slate-700 bg-bg md:w-24">
                        {m.iconoUrl && <img src={m.iconoUrl} alt="" className="pixelated absolute inset-0 size-full object-contain" />}
                      </div>
                      <div>
                        <h3 className="flex items-baseline gap-3">
                          <span className="font-display text-2xl uppercase text-terracotta-500 md:text-3xl">{m.nombreCorto}</span>
                          <span className="label-px text-[0.625rem] text-sand-300">{dos(m.numero)}</span>
                        </h3>
                        <p className="mt-2 text-white">{m.descripcion}</p>
                        {m.etiqueta && <span className="chip label-px mt-4 !text-[0.625rem]">{m.etiqueta}</span>}
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ListaManual titulo="Acciones" elementos={acciones.map((a) => ({ slug: a.slug, nombre: a.nombreCorto, descripcion: a.descripcion }))} />
              <ListaManual titulo="Reglas" elementos={datos.reglas} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function ListaManual({ titulo, elementos }: { titulo: string; elementos: { slug: string; nombre: string; descripcion: string | null }[] }) {
  if (elementos.length === 0) return null
  return (
    <Reveal className="h-full">
      <div className="panel h-full p-5 md:p-6">
        <h3 className="label-px text-[0.6875rem] text-sand-300">{titulo}</h3>
        <ul className="mt-3">
          {elementos.map((e) => (
            <li key={e.slug} className="border-b border-slate-700 py-3 last:border-b-0">
              <span className="font-display text-xl uppercase text-terracotta-500">{e.nombre}</span>
              {e.descripcion && <p className="mt-1 text-white">{e.descripcion}</p>}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

const ICONO_CATEGORIA: Record<string, IconName> = { poemas: 'scroll', 'notas-de-xi': 'map' }

export function Archives() {
  const { datos: categorias, error, reintentar } = useApi<CategoriaArchivo[]>('/archivos')
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true })
  const [abierto, setAbierto] = useState<string | null>(null)
  return (
    <section id="archivos" aria-labelledby="archivos-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeader label="Registro 06 · Colecciones" title="Archivos" titleId="archivos-title" subtitle="Vestigios de un tiempo que permanece." />
        {!categorias ? (
          <EstadoCarga error={error} onReintentar={reintentar} className="mt-12 max-w-4xl md:mt-16" />
        ) : (
          <ul className="mt-12 max-w-4xl space-y-4 md:mt-16">
            {categorias.map((c, i) => {
              const isOpen = !!open[i]
              return (
                <li key={c.slug}>
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
                          <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden border border-slate-700 bg-bg">
                            {c.iconoUrl ? <img src={c.iconoUrl} alt="" className="pixelated size-full object-contain" /> : <Pix name={ICONO_CATEGORIA[c.slug] ?? 'star'} className="size-5 text-terracotta-500" />}
                          </span>
                          <span className="flex-1">
                            <span className="label-px block text-[0.625rem] text-sand-300">
                              Colección {dos(i + 1)} · {dos(c.elementos.length)} registros
                            </span>
                            <span className="mt-1 block font-display text-xl uppercase text-terracotta-500 md:text-2xl">{c.nombre}</span>
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
                            {c.descripcion && <p className="text-white">{c.descripcion}</p>}
                            <ul className="mt-4">
                              {c.elementos.map((e) => (
                                <li key={e.slug}>
                                  <button
                                    type="button"
                                    aria-haspopup="dialog"
                                    onClick={() => setAbierto(e.slug)}
                                    className="flex w-full items-baseline gap-4 border-b border-slate-700 py-3 text-left transition-colors hover:bg-slate-800"
                                  >
                                    <span className="flex-1 text-cream-200">{e.titulo}</span>
                                    {e.ubicacion && <span className="label-px text-right text-[0.5625rem] text-sand-300">{e.ubicacion}</span>}
                                    <Pix name="arrowR" className="size-3 shrink-0 text-ambar-400" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {abierto && <ArchivoModal slug={abierto} onClose={() => setAbierto(null)} />}
    </section>
  )
}

function ArchivoModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { datos: a, error, reintentar } = useApi<Archivo>(`/archivos/${slug}`)
  const lugar = a && [a.sala?.nombre ?? a.ubicacion, a.zona?.nombre].filter(Boolean).join(' · ')
  return (
    <Dialogo tituloId="archivo-title" onClose={onClose} className="max-w-2xl">
      {!a ? (
        <>
          <h3 id="archivo-title" className="sr-only">
            Archivo
          </h3>
          <EstadoCarga error={error} onReintentar={reintentar} className="mt-10" />
        </>
      ) : (
        <article>
          {lugar && <p className="label-px pr-12 text-[0.625rem] text-sand-300">{lugar}</p>}
          <h3 id="archivo-title" className="title-display mt-3 text-4xl">
            {a.titulo}
          </h3>
          {a.imagenUrl && <MediaSlot ratio="16/9" label={a.titulo} src={a.imagenUrl} className="mt-5" />}
          <p className="mt-5 whitespace-pre-line text-lg text-white">{a.contenido}</p>
          {a.autor && <p className="label-px mt-6 text-[0.625rem] text-ambar-400">— {a.autor}</p>}
        </article>
      )}
    </Dialogo>
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
          <p className="mt-6 text-sm text-white">{CREDITS}</p>
        </div>
      </div>
      <div className="wrap label-px mt-14 flex flex-wrap justify-between gap-3 border-t border-slate-700 pt-6 text-[0.5625rem] text-cream-200/65">
        <span>© {new Date().getFullYear()} ASTROLABIO</span>
        <span>Sitio informativo · Contenido provisional</span>
      </div>
    </footer>
  )
}
