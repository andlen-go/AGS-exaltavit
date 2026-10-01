import { useMemo, useState } from 'react'
import { Attend } from './components/Attend'
import { BottomBar } from './components/BottomBar'
import { Dedication } from './components/Dedication'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MajorPartners, MajorPartnersRail } from './components/MajorPartners'
import { Merchandise } from './components/Merchandise'
import { Patronage } from './components/Patronage'
import { Preview } from './components/Preview'
import { Repertoire } from './components/Repertoire'
import { StickySupport } from './components/StickySupport'
import { SupportDrawer } from './components/SupportDrawer'
import { ThankYou } from './components/ThankYou'
import { Voices } from './components/Voices'
import { SupportDrawerContext } from './hooks/useSupportDrawer'

export default function App() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  const supportDrawer = useMemo(
    () => ({
      open: supportOpen,
      openDrawer: () => setSupportOpen(true),
      closeDrawer: () => setSupportOpen(false),
    }),
    [supportOpen],
  )

  return (
    <SupportDrawerContext.Provider value={supportDrawer}>
      <div className="pb-20 md:pb-0">
        <Header />
        <MajorPartners />
        <main>
          <Hero />
          <Dedication />
          <Preview />
          <Voices />
          <Repertoire />
          <Merchandise onSheetOpenChange={setSheetOpen} />
          <Patronage />
          <Attend />
          <ThankYou />
        </main>
        <Footer />
        <BottomBar hidden={sheetOpen} />
        <StickySupport hidden={sheetOpen} />
        <MajorPartnersRail />
        <SupportDrawer />
      </div>
    </SupportDrawerContext.Provider>
  )
}
