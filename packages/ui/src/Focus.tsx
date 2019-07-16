import { createStoreContext, react, useReaction } from '@o/use-store'
import { selectDefined } from '@o/utils'
import React from 'react'

import { useOnUnmount } from './hooks/useOnUnmount'
import { useVisibilityStore } from './Visibility'

// TODO
// this has two parts
//   1. a nestable, focus managing store with order for moving between
//   2. a simpler, value passing <FocusContext>

// part 1 is contained in the FocusManagerStore stuff, but on hold for now
// part 2 is here, simpler for now

//
// part 1
//

type FocusProps = { focused: boolean }

class FocusStore {
  props: FocusProps = {
    focused: false,
  }

  get focused() {
    return this.props.focused
  }
}

const FocusContext = createStoreContext(FocusStore)

// focus parents override children
export const ProvideFocus = (props: FocusProps & { children: any }) => {
  const parent = FocusContext.useStore()
  const focused =
    !parent || parent.focused === true
      ? selectDefined(props.focused, parent ? parent.focused : true)
      : false
  return <FocusContext.Provider focused={focused}>{props.children}</FocusContext.Provider>
}

export function useFocus() {
  try {
    const store = FocusContext.useStore()
    return selectDefined(store.focused, true)
  } catch {
    // no focus store provided
    return true
  }
}

//
// part 2
//

export class FocusManagerStore {
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
      lazy: true,
    },
  )

  setOrder() {
    this.focusOrder = this.getOrder()
  }

  // gets the order of things in the DOM
  getOrder() {
    if (!this.ids.length) {
      return []
    }
    const selectors = this.ids.map(id => `#${id}`).join(', ')
    const items = Array.from(document.querySelectorAll(selectors))
    return items.map((_, index) => {
      return this.ids[index]
    })
  }
}

const context = createStoreContext(FocusManagerStore)

export const useFocusManager = context.useStore
export const useCreateFocusManager = context.useCreateStore
export const ProvideFocusManager = context.Provider

// for sub-items
// attaches them as focsed when visibile
export function useFocusableItem(id: string, forceVisible?: boolean) {
  const focusStore = useFocusManager()
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
