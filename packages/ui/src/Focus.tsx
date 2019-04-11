import { createStoreContext, useReaction } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { useOnUnmount } from './hooks/useOnUnmount'
import { useVisibilityContext } from './Visibility'

export class FocusStore {
  index = -1
  ids = []
  focusOrder = []

  next() {
    this.index = Math.min(this.ids.length - 1, this.index + 1)
  }

  prev() {
    this.index = Math.max(-1, this.index - 1)
  }

  // must be a unique id
  mountItem(id: string) {
    this.ids = [...this.ids, id]
  }

  unmountItem(id: string) {
    const index = this.ids.indexOf(id)
    if (index >= 0) {
      this.ids = this.ids.splice(index, 1)
    }
  }

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
export const ProvideFocusStore = context.Provider

// for sub-items
// attaches them as focsed when visibile
export function useFocusableItem(id: string, forceVisible?: boolean) {
  const focusStore = useFocusStore()
  const getVisible = useVisibilityContext().getVisible

  useReaction(
    () => selectDefined(forceVisible, getVisible()),
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
}
