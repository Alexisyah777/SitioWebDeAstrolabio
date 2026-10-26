import { useEffect, useState } from 'react'

/*
 * Cliente de Astrolabio API (solo lectura). Contrato completo:
 * https://github.com/Natanael2005/astrolabio-api/blob/develop/docs/ENDPOINTS.md
 *
 * Las rutas son relativas al sitio: en Vercel, /api/* se reenvía a la API (vercel.json)
 * y en local lo hace el proxy de Vite (vite.config.ts). Así no hace falta CORS.
 */
const BASE = '/api/v1'

// Si nadie ha usado la API en un rato, la primera respuesta tarda unos segundos (arranque en frío).
const ESPERA_MS = 15_000

export class ErrorApi extends Error {
  constructor(
    mensaje: string,
    readonly estado?: number,
  ) {
    super(mensaje)
  }
}

async function pedir<T>(ruta: string): Promise<T> {
  const control = new AbortController()
  const temporizador = setTimeout(() => control.abort(), ESPERA_MS)
  try {
    const res = await fetch(BASE + ruta, { signal: control.signal, headers: { Accept: 'application/json' } })
    const cuerpo = await res.json().catch(() => null)
    if (!res.ok) throw new ErrorApi(cuerpo?.error?.mensaje ?? `El Gran Reloj respondió ${res.status}.`, res.status)
    if (!cuerpo || !('data' in cuerpo)) throw new ErrorApi('El Gran Reloj respondió algo inesperado.', res.status)
    return cuerpo.data as T
  } catch (error) {
    if (error instanceof ErrorApi) throw error
    throw new ErrorApi('No se pudo conectar con el Gran Reloj.')
  } finally {
    clearTimeout(temporizador)
  }
}

// Una misma ruta se pide una sola vez por visita. Si falla, se olvida para poder reintentar.
const pendientes = new Map<string, Promise<unknown>>()
const resueltos = new Map<string, unknown>()

export function obtener<T>(ruta: string): Promise<T> {
  let promesa = pendientes.get(ruta) as Promise<T> | undefined
  if (!promesa) {
    // Sin red o con tiempo agotado se reintenta una vez; un 404 o un 500 no.
    promesa = pedir<T>(ruta)
      .catch((error) => (error instanceof ErrorApi && error.estado === undefined ? pedir<T>(ruta) : Promise.reject(error)))
      .then((datos) => {
        resueltos.set(ruta, datos)
        return datos
      })
      .catch((error) => {
        pendientes.delete(ruta)
        throw error
      })
    pendientes.set(ruta, promesa)
  }
  return promesa
}

type Estado<T> = { datos?: T; error?: string; cargando: boolean }

const estadoInicial = <T,>(ruta: string | null): Estado<T> =>
  ruta && resueltos.has(ruta) ? { datos: resueltos.get(ruta) as T, cargando: false } : { cargando: ruta !== null }

/** Pide `ruta` a la API (o nada si es null) y devuelve los datos, el error y cómo reintentar. */
export function useApi<T>(ruta: string | null) {
  const [estado, setEstado] = useState<Estado<T>>(() => estadoInicial<T>(ruta))
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    setEstado(estadoInicial<T>(ruta))
    if (!ruta || resueltos.has(ruta)) return
    let vigente = true
    obtener<T>(ruta).then(
      (datos) => vigente && setEstado({ datos, cargando: false }),
      (error: Error) => vigente && setEstado({ error: error.message, cargando: false }),
    )
    return () => {
      vigente = false
    }
  }, [ruta, intento])

  return { ...estado, reintentar: () => setIntento((n) => n + 1) }
}

/* ─────────────────────────────────────────────
 * Formas de las respuestas (docs/ENDPOINTS.md)
 * ───────────────────────────────────────────── */

export type Referencia = { slug: string; nombre: string }

export type EntradaHistoria = { slug: string; titulo: string; contenido: string | null; imagenUrl: string | null }
export type SeccionHistoria = { slug: string; titulo: string; entradas: EntradaHistoria[] }

export type TipoZona = 'eje' | 'casa' | 'cierre'

export type PuntoMapa = {
  slug: string
  nombre: string
  subtitulo: string | null
  tipo: TipoZona
  resumen: string | null
  x: number
  y: number
}
export type Mapa = { titulo: string; descripcion: string | null; imagenUrl: string | null; puntos: PuntoMapa[] }

export type SalaResumen = { slug: string; nombre: string; orden: number; esZonaSegura: boolean; esObservatorio: boolean }
export type Zona = {
  slug: string
  nombre: string
  subtitulo: string | null
  tipo: TipoZona
  esNivel: boolean
  esTutorial: boolean
  etiquetas: string[]
  resumen: string | null
  imagenUrl: string | null
  constelacion: { nombre: string; sobrenombre: string | null } | null
  salas: SalaResumen[]
  mecanicas: { slug: string; nombre: string; descripcion: string | null }[]
}

export type PersonajeResumen = { slug: string; nombre: string; rol: string; resumen: string | null; imagenUrl: string | null }
export type Rasgo = { nombre: string; descripcion: string | null }
export type Personaje = PersonajeResumen & {
  titulo: string | null
  estado: string | null
  origen: string | null
  motivacion: string | null
  personalidad: string | null
  arco: string | null
  rasgos: Record<string, Rasgo[]>
}

export type Habilidad = {
  slug: string
  numero: number
  nombreCorto: string
  nombre: string
  etiqueta: string | null
  tipo: 'mecanica' | 'narrativa'
  descripcion: string | null
  iconoUrl: string | null
}
export type Regla = { slug: string; nombre: string; descripcion: string | null }
export type Mecanicas = { habilidades: Habilidad[]; reglas: Regla[] }

export type ElementoArchivo = { slug: string; titulo: string; ubicacion: string | null; imagenUrl: string | null }
export type CategoriaArchivo = {
  slug: string
  nombre: string
  descripcion: string | null
  iconoUrl: string | null
  elementos: ElementoArchivo[]
}
export type Archivo = {
  slug: string
  titulo: string
  categoria: string
  contenido: string | null
  autor: string | null
  ubicacion: string | null
  imagenUrl: string | null
  zona: Referencia | null
  sala: Referencia | null
}
