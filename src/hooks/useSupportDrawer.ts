import { createContext, useContext } from 'react'

export type SupportDrawerState = {
  open: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

export const SupportDrawerContext = createContext<SupportDrawerState>({
  open: false,
  openDrawer: () => {},
  closeDrawer: () => {},
})

export function useSupportDrawer() {
  return useContext(SupportDrawerContext)
}
