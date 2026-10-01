import { createContext, useContext } from 'react'

export type SupportPreset = { amount: number; id: number }

export type SupportDrawerState = {
  open: boolean
  /** Latest amount requested by an "open with amount" call; id changes on every request */
  preset: SupportPreset | null
  /** Accepts an amount, or anything else (e.g. a click event) to open without a preset */
  openDrawer: (amount?: unknown) => void
  closeDrawer: () => void
}

export const SupportDrawerContext = createContext<SupportDrawerState>({
  open: false,
  preset: null,
  openDrawer: () => {},
  closeDrawer: () => {},
})

export function useSupportDrawer() {
  return useContext(SupportDrawerContext)
}
