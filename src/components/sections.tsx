import { useEffect, useState } from 'react'
import { ABOUT, HERO, STORY, TRAILER_MP4, TRAILER_URL } from '../content'
import { parseYouTubeId, PLAY_EVENT, playTrailer, prefersReducedMotion, scrollToId } from '../lib'
import { Astrolabe, Corners, MediaSlot, Pix, Reveal, SectionHeader } from './ui'

export function Hero({ ready }: { ready: boolean }) {
  const full = HERO.title
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!ready) return
    if (prefersReducedMotion()) {
      setN(full.length)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i++
      setN(i)
      if (i >= full.length) clearInterval(id)
    }, 70)
    return () => clearInterval(id)
  }, [ready, full])

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden pb-28 pt-28 md:pt-32">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="label-px flex items-center gap-3 text-[0.625rem] text-sand-300 md:text-[0.6875rem]">
            <Pix name="star" className="size-3 text-ambar-400" />
            {HERO.label}
          </p>
          <h1 id="hero-title" className="mt-6 font-display uppercase leading-[1.04] text-cream-200 [text-shadow:4px_4px_0_#000]" style={{ fontSize: 'clamp(2.4rem, 5.4vw, 5rem)' }}>
            <span className="sr-only">{full}</span>
            <span aria-hidden="true" className="grid">
              <span className="invisible col-start-1 row-start-1">{full}</span>
              <span className="col-start-1 row-start-1">
                {full.slice(0, n)}
                <span className="caret" />
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white md:text-xl">{HERO.subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button type="button" className="btn btn-primary" onClick={playTrailer}>
              <Pix name="play" className="h-3 w-2" />
              Ver tráiler
            </button>
            <a
              href="#historia"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('historia')
              }}
            >
              Descubre la historia
            </a>
          </div>
        </div>
        <Reveal delay={2} className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 w-[130%] -translate-x-1/2 -translate-y-1/2 text-terracotta-500/40">
            <Astrolabe className="spin-slow w-full" />
          </div>
          <div className="relative shadow-[8px_8px_0_#000]">
            <MediaSlot ratio="16/9" label="Key art" alt="Key art de ASTROLABIO" />
          </div>
          <p className="label-px relative mt-4 flex justify-between text-[0.5625rem] text-cream-200/65">
            <span>Fig. 01 — Key art</span>
            <span>Hora XII · Lat. 12°</span>
          </p>
        </Reveal>
      </div>
      <a
        href="#que-es"
        onClick={(e) => {
          e.preventDefault()
          scrollToId('que-es')
        }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-sand-300"
        aria-label="Desplázate para continuar"
      >
        <span className="label-px text-[0.5625rem]">Desliza</span>
        <Pix name="arrowD" className="bob size-4 text-ambar-400" />
      </a>
    </section>
  )
}

export function About() {
  return (
    <section id="que-es" aria-labelledby="que-es-title" className="relative py-24 md:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <SectionHeader label="Registro 00 · Expediente" title="Qué es Astrolabio" titleId="que-es-title" />
          {ABOUT.body.map((p, i) => (
            <Reveal key={i} delay={i + 2}>
              <p className="mt-5 max-w-xl text-lg text-white">{p}</p>
            </Reveal>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-4 md:gap-5">
          {ABOUT.facts.map((f, i) => (
            <li key={f.label}>
              <Reveal delay={i} className="h-full">
                <div className="panel flex h-full flex-col gap-4 p-5 transition-colors hover:bg-slate-800 md:p-6">
                  <span className="flex size-11 items-center justify-center border border-slate-700 bg-bg">
                    <Pix name={f.icon} className="size-5 text-terracotta-500" />
                  </span>
                  <span>
                    <span className="block font-display text-4xl text-sand-300 md:text-5xl">{f.value}</span>
                    <span className="label-px mt-1 block text-[0.625rem] text-cream-200/80">{f.label}</span>
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Story() {
  return (
    <section id="historia" aria-labelledby="historia-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeader label="Registro 01 · Sinopsis" title="Historia" titleId="historia-title" subtitle="El origen del Gran Reloj, contado a su tiempo." />
        <div className="relative mt-16 md:mt-24">
          <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 border-l border-dashed border-slate-700 md:block" />
          <ol className="space-y-20 md:space-y-32">
            {STORY.map((c, i) => (
              <li key={c.title} className="relative grid items-center gap-8 md:grid-cols-2 md:gap-20">
                <span aria-hidden="true" className="absolute left-1/2 top-1/2 hidden size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-ambar-400 bg-bg md:block" />
                <Reveal className={i % 2 ? 'md:order-2' : ''}>
                  <MediaSlot ratio="4/3" label={c.image} alt={`Ilustración: ${c.image}`} className="shadow-[6px_6px_0_#000]" />
                </Reveal>
                <Reveal delay={1} className={i % 2 ? 'md:order-1' : ''}>
                  <p className="label-px text-ambar-400">Capítulo 0{i + 1}</p>
                  <h3 className="mt-3 font-display text-3xl uppercase text-sand-300 md:text-4xl">{c.title}</h3>
                  <p className="mt-4 max-w-md text-lg text-white md:text-xl">{c.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <Reveal className="mt-24 text-center md:mt-36">
          <Pix name="star" className="mx-auto size-5 text-ambar-400" />
          <blockquote className="mx-auto mt-6 max-w-3xl font-display uppercase leading-tight text-sand-300 [text-shadow:3px_3px_0_#000]" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}>
            “Cada secreto, a su tiempo.”
          </blockquote>
          <button type="button" className="btn btn-primary mt-10" onClick={playTrailer}>
            <Pix name="play" className="h-3 w-2" />
            Ver el tráiler
          </button>
        </Reveal>
      </div>
    </section>
  )
}

export function Trailer() {
  const [playing, setPlaying] = useState(false)
  const ytId = parseYouTubeId(TRAILER_URL)

  useEffect(() => {
    const h = () => {
      scrollToId('trailer')
      setPlaying(true)
    }
    addEventListener(PLAY_EVENT, h)
    return () => removeEventListener(PLAY_EVENT, h)
  }, [])

  return (
    <section id="trailer" aria-labelledby="trailer-title" className="relative border-y border-slate-700 bg-black/65 py-24 md:py-32">
      <div className="wrap">
        <SectionHeader label="Registro 02 · Transmisión" title="Tráiler" titleId="trailer-title" subtitle="Una mirada al interior del Gran Reloj." />
        <Reveal className="mt-12 md:mt-16">
          <div className="relative border-2 border-slate-700 bg-obsidian-900 p-2 shadow-[8px_8px_0_#000] md:p-4">
            <div className="label-px mb-2 flex items-center justify-between text-[0.5625rem] text-cream-200/75 md:mb-3 md:text-[0.625rem]">
              <span className="flex items-center gap-2">
                <span className="size-2 animate-[blink_1.2s_steps(1)_infinite] bg-ambar-400" />
                Canal XII · Señal del Gran Reloj
              </span>
              <span>16:9</span>
            </div>
            <div className={`relative aspect-video overflow-hidden border border-slate-700 bg-black ${playing ? '' : 'scanlines'}`}>
              {!playing ? (
                <>
                  <MediaSlot ratio="16/9" label="Póster del tráiler" quiet className="absolute inset-0 border-0" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      aria-label="Reproducir tráiler de ASTROLABIO"
                      className="flex size-20 items-center justify-center border-2 border-bg bg-ambar-400 text-bg shadow-[6px_6px_0_#000] transition-[transform,box-shadow,background-color] [transition-timing-function:steps(2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-sand-300 hover:shadow-[3px_3px_0_#000] md:size-28"
                    >
                      <Pix name="play" className="ml-1 h-8 w-5 md:h-11 md:w-7" />
                    </button>
                    <span className="label-px text-[0.625rem] text-sand-300">Pulsa para reproducir</span>
                  </div>
                </>
              ) : ytId ? (
                <iframe
                  className="absolute inset-0 size-full"
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                  title="Tráiler de ASTROLABIO"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : TRAILER_MP4 ? (
                <video className="absolute inset-0 size-full" src={TRAILER_MP4} controls autoPlay playsInline />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <Pix name="clock" className="size-10 text-ambar-400" />
                  <p className="label-px text-ambar-400">Señal pendiente</p>
                  <p className="max-w-md text-white">El tráiler oficial se transmitirá aquí muy pronto.</p>
                  <button type="button" className="btn btn-ghost" onClick={() => setPlaying(false)}>
                    Volver
                  </button>
                </div>
              )}
            </div>
            <Corners all out className="text-ambar-400" />
          </div>
        </Reveal>
        <a
          href="#mundo"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('mundo')
          }}
          className="group mx-auto mt-14 flex w-fit flex-col items-center gap-3 text-sand-300 hover:text-ambar-400"
        >
          <span className="font-display text-xl uppercase md:text-2xl">Explora el Gran Reloj</span>
          <Pix name="arrowD" className="bob size-4 text-ambar-400" />
        </a>
      </div>
    </section>
  )
}
