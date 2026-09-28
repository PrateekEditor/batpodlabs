import { useEffect, useState } from 'react'
import { TopNav } from './components/nav/TopNav'
import { SplitScrollPage } from './components/scroll/SplitScrollPage'
import { SECTIONS, type SectionDef } from './data/sections'
import { CoderIcon } from './components/icons3d/CoderIcon'
import { BikerIcon } from './components/icons3d/BikerIcon'
import { EcommerceIcon } from './components/icons3d/EcommerceIcon'
import { AboutIcon } from './components/icons3d/AboutIcon'

const ICONS: Record<SectionDef['id'], typeof CoderIcon> = {
  coder: CoderIcon,
  biker: BikerIcon,
  ecommerce: EcommerceIcon,
  about: AboutIcon,
}

function App() {
  const [active, setActive] = useState<SectionDef['id']>('coder')
  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]
  const Icon = ICONS[active]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [active])

  return (
    <main className="relative">
      <TopNav active={active} onChange={setActive} />
      <div className="pointer-events-none fixed left-1/2 top-24 z-20 -translate-x-1/2 text-center sm:top-28">
        <p className="text-xs tracking-[0.2em] text-white/40 uppercase">BatpodLabs</p>
      </div>
      <SplitScrollPage key={section.id} section={section} Icon={Icon} />
    </main>
  )
}

export default App
