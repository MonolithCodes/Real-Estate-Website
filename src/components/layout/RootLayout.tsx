import { LazyMotion, domAnimation } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { useLenis } from '../../hooks/useLenis'
import { FloatingContact } from './FloatingContact'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileActionBar } from './MobileActionBar'
import { ScrollManager } from './ScrollManager'

export function RootLayout() {
  useLenis()

  return (
    <LazyMotion features={domAnimation}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main" className="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
      <MobileActionBar />
    </LazyMotion>
  )
}
