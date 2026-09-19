import { lazy, Suspense, useEffect, useState } from 'react'
import { useSite } from "./SiteContext"
import Nav from './components/Nav'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Commissions from './components/Commissions'
import HowItWorks from './components/HowItWorks'
import About from './components/About'
import Footer from './components/Footer'
const AdminPanel = lazy(() => import('./components/AdminPanel'))

export default function App() {
  const { t } = useSite()
  const [admin, setAdmin] = useState(location.hash === '#admin')
  useEffect(() => {
    const on = () => setAdmin(location.hash === '#admin')
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#work">{t.skip}</a>
      <Nav />
      <main>
        <Hero />
        <Portfolio />
        <Commissions />
        <HowItWorks />
        <About />
      </main>
      <Footer />
      {admin && <Suspense fallback={null}><AdminPanel onClose={() => { location.hash = '' }} /></Suspense>}
    </>
  )
}
