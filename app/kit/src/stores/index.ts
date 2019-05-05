import { SelectableStore } from '@o/ui'
import { AppStore } from './AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { QueryStore } from './QueryStore'
import { SpaceStore } from './SpaceStore'
import { SubPaneStore } from './SubPaneStore'
import { ThemeStore } from './ThemeStore'

export type KitStores = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  queryStore?: QueryStore
  selectableStore?: SelectableStore
  themeStore?: ThemeStore
  spaceStore?: SpaceStore
}

export { SelectableStore } from '@o/ui'
export { AppStore } from './AppStore'
export { NLPStore } from './NLPStore/NLPStore'
export { PaneManagerStore } from './PaneManagerStore'
export { QueryFilterStore } from './QueryFilterStore'
export { QueryStore } from './QueryStore'
export { SpaceStore } from './SpaceStore'
export { SubPaneStore } from './SubPaneStore'
export { ThemeStore } from './ThemeStore'
