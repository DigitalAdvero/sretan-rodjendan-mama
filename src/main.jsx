import { MotionConfig, MotionGlobalConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './fonts.css'
import './index.css'
import { SmoothScroll } from './lib/scroll.jsx'
import { SoundProvider } from './lib/sound.jsx'

// Development only: open http://localhost:5173/?instant to check layouts with all animations finished.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('instant')) {
  MotionGlobalConfig.skipAnimations = true
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <SoundProvider>
          <App />
        </SoundProvider>
      </SmoothScroll>
    </MotionConfig>
  </StrictMode>,
)
