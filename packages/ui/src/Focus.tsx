import { createStoreContext, react, useReaction } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { useOnUnmount } from './hooks/useOnUnmount'
import { useVisibilityStore } from './Visibility'

export class FocusStore {
  active = -1
  ids = []
  focusOrder = []

  next() {
    this.active = Math.min(this.ids.length - 1, this.active + 1)
  }

  prev() {
    this.active = Math.max(-1, this.active - 1)
  }

  isFocused(id: string) {
    return this.focusOrder.findIndex(x => x === id) === this.active
  }

  // must be a unique id
  mountItem(id: string) {
    this.ids = [...this.ids, id]
    this.deferUpdate()
  }

  unmountItem(id: string) {
    const index = this.ids.indexOf(id)
    if (index >= 0) {
      this.ids = this.ids.splice(index, 1)
    }
    this.deferUpdate()
  }

  tm = 0
  deferUpdate = () => {
    this.tm = Math.random()
  }

  update = react(
    () => this.tm,
    async (_, { sleep }) => {
      await sleep(200)
      this.setOrder()
    },
    {
      deferFirstRun: true,
    },
  )

  setOrder() {
    this.focusOrder = this.getOrder()
  }

  // gets the order of things in the DOM
  getOrder() {
    const items = Array.from(document.querySelectorAll(this.ids.map(id => `#${id}`).join(', ')))
    return items.map((_, index) => {
      return this.ids[index]
    })
  }
}

const context = createStoreContext(FocusStore)

export const useFocusStore = context.useStore
export const useCreateFocusStore = context.useCreateStore
export const ProvideFocus = context.Provider

// for sub-items
// attaches them as focsed when visibile
export function useFocusableItem(id: string, forceVisible?: boolean) {
  const focusStore = useFocusStore()
  const visStore = useVisibilityStore()

  useReaction(
    () => selectDefined(forceVisible, visStore.visible),
    isVisible => {
      if (isVisible) {
        focusStore.mountItem(id)
      } else {
        focusStore.unmountItem(id)
      }
    },
  )

  useOnUnmount(() => {
    focusStore.unmountItem(id)
  })

  return focusStore.isFocused(id)
}
