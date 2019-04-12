import { createStoreContext } from '@o/use-store'

class ShareStore {
  selected = []

  setSelected(next: any[]) {
    this.selected = next
  }
}

const context = createStoreContext(ShareStore)

export const useShareStore = context.useStore
export const useCreateShareStore = context.useCreateStore
export const ProvideShare = context.Provider
