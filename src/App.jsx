import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import AmbientParticles from './components/AmbientParticles'
import Dova from './components/Dova'
import Finale from './components/Finale'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Letter from './components/Letter'
import SoundToggle from './components/SoundToggle'
import Surprises from './components/Surprises'
import { jumpToTop, useLenis } from './lib/scroll'

export default function App() {
  const [introOpen, setIntroOpen] = useState(true)
  const lenis = useLenis()
  const replayTimer = useRef(0)

  useEffect(() => () => clearTimeout(replayTimer.current), [])

  const finishIntro = () => {
    jumpToTop(lenis)
    setIntroOpen(false)
  }

  // Show the gift again, then quietly return to the top behind it.
  const replay = () => {
    setIntroOpen(true)
    clearTimeout(replayTimer.current)
    replayTimer.current = setTimeout(() => jumpToTop(lenis), 850)
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <AmbientParticles />
      <SoundToggle />

      <div className="relative z-10 overflow-x-clip" inert={introOpen}>
        <main>
          <Hero ready={!introOpen} />
          <Letter />
          <Gallery />
          <Surprises />
          <Dova />
        </main>
        <Finale onReplay={replay} />
      </div>

      <AnimatePresence>{introOpen && <Intro key="intro" onFinish={finishIntro} />}</AnimatePresence>
    </>
  )
}
