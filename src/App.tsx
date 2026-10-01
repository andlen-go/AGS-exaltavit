import { useState } from 'react'
import { Attend } from './components/Attend'
import { BottomBar } from './components/BottomBar'
import { Choir } from './components/Choir'
import { Footer } from './components/Footer'
import { Funding } from './components/Funding'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Merchandise } from './components/Merchandise'
import { Sponsorship } from './components/Sponsorship'
import { ThankYou } from './components/ThankYou'

export default function App() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="pb-20 md:pb-0">
      <Header />
      <main>
        <Hero />
        <Funding onSheetOpenChange={setSheetOpen} />
        <Merchandise onSheetOpenChange={setSheetOpen} />
        <Sponsorship />
        <Choir />
        <Attend />
        <ThankYou />
      </main>
      <Footer />
      <BottomBar hidden={sheetOpen} />
    </div>
  )
}
