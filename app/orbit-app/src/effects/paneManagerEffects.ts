import { usePaneManagerPaneSort } from './paneManagerPaneSort'
import { usePaneManagerUpdatePanes } from './paneManagerStoreUpdatePanes'

export function usePaneManagerEffects() {
  usePaneManagerPaneSort()
  usePaneManagerUpdatePanes()
}
