import { SelectableStore } from '@o/ui'

import { AppStore } from './AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { QueryStore } from './QueryStore'
import { SubPaneStore } from './SubPaneStore'
import { ThemeStore } from './ThemeStore'

export type KitStores = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  queryStore?: QueryStore
  selectableStore?: SelectableStore
  themeStore?: ThemeStore
}

export { SelectableStore } from '@o/ui'
export { AppStore } from './AppStore'
export { NLPStore } from './NLPStore/NLPStore'
export { PaneManagerStore } from './PaneManagerStore'
export { QueryFilterStore } from './QueryFilterStore'
export { QueryStore } from './QueryStore'
export { SubPaneStore } from './SubPaneStore'
export { ThemeStore } from './ThemeStore'
