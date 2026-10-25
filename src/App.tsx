import { useCallback, useState } from 'react'
import { ClockIndicator, Loader, MenuOverlay, Navbar, Starfield } from './components/chrome'
import { About, Hero, Story, Trailer } from './components/sections'
import { Archives, Characters, Footer, Mechanics, World } from './components/universe'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [menu, setMenu] = useState(false)
  const closeMenu = useCallback(() => setMenu(false), [])

  return (
    <>
      <Starfield />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <a href="#contenido" className="label-px fixed left-3 top-3 z-[70] -translate-y-[200%] bg-ambar-400 px-3 py-2 text-bg focus:translate-y-0">
        Saltar al contenido
      </a>
      <Navbar menuOpen={menu} onMenu={() => setMenu(true)} />
      <MenuOverlay open={menu} onClose={closeMenu} />
      <ClockIndicator />
      <div className="relative z-10">
        <main id="contenido">
          <Hero ready={loaded} />
          <About />
          <Story />
          <Trailer />
          <World />
          <Characters />
          <Mechanics />
          <Archives />
        </main>
        <Footer />
      </div>
    </>
  )
}
