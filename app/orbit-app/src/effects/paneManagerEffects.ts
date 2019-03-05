import { usePaneManagerPaneSort } from './paneManagerPaneSort'
import { usePaneManagerUpdatePanes } from './paneManagerStoreUpdatePanes'
import { usePaneLocationEffect } from './usePaneLocationEffect'

export function usePaneManagerEffects() {
  usePaneLocationEffect()
  usePaneManagerPaneSort()
  usePaneManagerUpdatePanes()
}
