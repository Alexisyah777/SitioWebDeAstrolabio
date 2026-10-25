export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

export const PLAY_EVENT = 'astrolabio:play-trailer'
/** Hace scroll al tráiler y lo reproduce (navbar, hero, historia). */
export const playTrailer = () => window.dispatchEvent(new Event(PLAY_EVENT))

export function parseYouTubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  if (m) return m[1]
  return /^[\w-]{11}$/.test(url) ? url : null
}

export function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}
