import { useMemo, useState } from 'react'
import { Attend } from './components/Attend'
import { BottomBar } from './components/BottomBar'
import { CartButton } from './components/CartButton'
import { CartPanel } from './components/CartPanel'
import { Dedication } from './components/Dedication'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MajorPartners, PartnersBar } from './components/MajorPartners'
import { Merchandise } from './components/Merchandise'
import { Patronage } from './components/Patronage'
import { Preview } from './components/Preview'
import { Repertoire } from './components/Repertoire'
import { ShareBand } from './components/ShareBar'
import { StickySupport } from './components/StickySupport'
import { SupportDrawer } from './components/SupportDrawer'
import { ThankYou } from './components/ThankYou'
import { Voices } from './components/Voices'
import { CartContext, useCart, type CartStore } from './hooks/useCart'
import { SupportDrawerContext, type SupportPreset } from './hooks/useSupportDrawer'

export default function App() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportPreset, setSupportPreset] = useState<SupportPreset | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [addedTick, setAddedTick] = useState(0)
  const cart = useCart()
  const supportDrawer = useMemo(
    () => ({
      open: supportOpen,
      preset: supportPreset,
      openDrawer: (amount?: unknown) => {
        if (typeof amount === 'number' && amount > 0) setSupportPreset((previous) => ({ amount, id: (previous?.id ?? 0) + 1 }))
        setCartOpen(false)
        setSupportOpen(true)
      },
      closeDrawer: () => setSupportOpen(false),
    }),
    [supportOpen, supportPreset],
  )

  const cartStore: CartStore = {
    ...cart,
    addItem: (...args: Parameters<typeof cart.addItem>) => {
      cart.addItem(...args)
      setAddedTick((tick) => tick + 1)
    },
    open: cartOpen,
    openCart: () => {
      setSupportOpen(false)
      setCartOpen(true)
    },
    closeCart: () => setCartOpen(false),
    addedTick,
  }

  const overlayOpen = sheetOpen || cartOpen

  return (
    <SupportDrawerContext.Provider value={supportDrawer}>
      <CartContext.Provider value={cartStore}>
        <div className="pb-20 md:pb-0">
          <Header />
          <MajorPartners />
          <main>
            <Hero />
            <ShareBand />
            <Dedication />
            <Preview />
            <Voices />
            <Repertoire />
            <Merchandise />
            <Patronage />
            <Attend onSheetOpenChange={setSheetOpen} />
            <ThankYou />
            <PartnersBar />
          </main>
          <Footer />
          <BottomBar hidden={overlayOpen} />
          <StickySupport hidden={overlayOpen} />
          <CartButton hidden={sheetOpen || supportOpen} />
          <CartPanel />
          <SupportDrawer />
        </div>
      </CartContext.Provider>
    </SupportDrawerContext.Provider>
  )
}
