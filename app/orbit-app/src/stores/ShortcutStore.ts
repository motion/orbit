import { SelectionStore } from './SelectionStore'

export class ShortcutStore {
  activeSelectionStore?: SelectionStore

  setActiveSelectionStore(store: SelectionStore) {
    this.activeSelectionStore = store
  }
}
