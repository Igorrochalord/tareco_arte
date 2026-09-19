import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { SiteProvider } from './SiteContext'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <SiteProvider>
        <App />
      </SiteProvider>
    </MotionConfig>
  </StrictMode>,
)
