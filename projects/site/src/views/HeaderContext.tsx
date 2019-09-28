import { createStoreContext } from '@o/kit'

export const HeaderContext = createStoreContext(
  class HeaderStore {
    shown = true
    setShown(next: boolean) {
      console.log('set shown', next)
      this.shown = next
    }
  },
)
