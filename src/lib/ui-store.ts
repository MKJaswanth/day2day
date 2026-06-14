import { create } from "zustand"

type UIState = {
  commandOpen: boolean
  captureOpen: boolean
  setCommandOpen: (open: boolean) => void
  setCaptureOpen: (open: boolean) => void
  toggleCommand: () => void
  toggleCapture: () => void
}

/** Lightweight client-only UI state (overlays), per the architecture's Zustand role. */
export const useUIStore = create<UIState>((set) => ({
  commandOpen: false,
  captureOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  setCaptureOpen: (open) => set({ captureOpen: open }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  toggleCapture: () => set((s) => ({ captureOpen: !s.captureOpen })),
}))
