// Genera los íconos de la PWA en pixel art a partir del reloj del sitio
// (ICONS.clock en src/components/ui.tsx). No necesita dependencias.
// Uso: node scripts/generar-iconos.mjs  → escribe en public/
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const RELOJ = ['..#####..', '.#.....#.', '#...#...#', '#...#...#', '#...##..#', '#.......#', '#.......#', '.#.....#.', '..#####..']
const FONDO = [0x0b, 0x15, 0x1e] // --bg
const TINTA = [0xff, 0xaa, 0x5e] // --ambar-400

// Rejilla de 15×15 celdas con el reloj de 9×9 al centro: deja margen para los íconos
// "maskable", que Android recorta en círculo.
const CELDAS = 15
const MARGEN = (CELDAS - RELOJ.length) / 2

function png(lado) {
  const celda = Math.floor(lado / CELDAS)
  const desfase = Math.floor((lado - celda * CELDAS) / 2)
  const filas = Buffer.alloc(lado * (lado * 3 + 1))
  for (let y = 0; y < lado; y++) {
    const inicio = y * (lado * 3 + 1)
    filas[inicio] = 0 // sin filtro
    for (let x = 0; x < lado; x++) {
      const cx = Math.floor((x - desfase) / celda) - MARGEN
      const cy = Math.floor((y - desfase) / celda) - MARGEN
      const encendido = x >= desfase && y >= desfase && RELOJ[cy]?.[cx] === '#'
      const color = encendido ? TINTA : FONDO
      filas.set(color, inicio + 1 + x * 3)
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(lado, 0)
  ihdr.writeUInt32BE(lado, 4)
  ihdr.set([8, 2, 0, 0, 0], 8) // 8 bits, RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque('IHDR', ihdr),
    bloque('IDAT', deflateSync(filas)),
    bloque('IEND', Buffer.alloc(0)),
  ])
}

function bloque(tipo, datos) {
  const largo = Buffer.alloc(4)
  largo.writeUInt32BE(datos.length)
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(cuerpo))
  return Buffer.concat([largo, cuerpo, crc])
}

function crc32(buffer) {
  let crc = ~0
  for (const byte of buffer) {
    crc ^= byte
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
  }
  return ~crc >>> 0
}

function svg() {
  const pixeles = RELOJ.flatMap((fila, y) => [...fila].map((c, x) => (c === '#' ? `M${x + MARGEN} ${y + MARGEN}h1v1h-1z` : ''))).join('')
  const hex = (rgb) => `#${rgb.map((n) => n.toString(16).padStart(2, '0')).join('')}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CELDAS} ${CELDAS}" shape-rendering="crispEdges"><rect width="${CELDAS}" height="${CELDAS}" fill="${hex(FONDO)}"/><path d="${pixeles}" fill="${hex(TINTA)}"/></svg>\n`
}

const salidas = {
  'public/icono-192.png': png(192),
  'public/icono-512.png': png(512),
  'public/apple-touch-icon.png': png(180),
  'public/favicon.svg': svg(),
}
for (const [ruta, contenido] of Object.entries(salidas)) {
  writeFileSync(ruta, contenido)
  console.log(`✔ ${ruta}`)
}
