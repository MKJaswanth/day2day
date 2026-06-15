import { create } from "zustand"

type PeekTarget =
  | { type: "task"; id: string }
  | { type: "project"; id: string }
  | { type: "follow_up"; id: string }
  | { type: "learning_item"; id: string }
  | null

type UIState = {
  commandOpen: boolean
  captureOpen: boolean
  peek: PeekTarget
  setCommandOpen: (open: boolean) => void
  setCaptureOpen: (open: boolean) => void
  toggleCommand: () => void
  toggleCapture: () => void
  openPeek: (target: NonNullable<PeekTarget>) => void
  closePeek: () => void
}

/** Lightweight client-only UI state (overlays), per the architecture's Zustand role. */
export const useUIStore = create<UIState>((set) => ({
  commandOpen: false,
  captureOpen: false,
  peek: null,
  setCommandOpen: (open) => set({ commandOpen: open }),
  setCaptureOpen: (open) => set({ captureOpen: open }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  toggleCapture: () => set((s) => ({ captureOpen: !s.captureOpen })),
  openPeek: (target) => set({ peek: target }),
  closePeek: () => set({ peek: null }),
}))
