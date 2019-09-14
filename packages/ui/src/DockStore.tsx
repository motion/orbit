import { createStoreContext } from '@o/use-store'

import { DockButtonProps } from './Dock'
import { createContextualProps } from './helpers/createContextualProps'

export class DockStore {
  key = 0
  items = {}
  next = {}
  rerender = () => {
    this.items = { ...this.next }
    this.key = Math.random()
  }
}

export const DockStoreContext = createStoreContext(DockStore)
export const DockButtonPropsContext = createContextualProps<DockButtonProps>()
export const DockButtonPassProps = DockButtonPropsContext.PassProps
