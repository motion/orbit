import { SelectableStore } from '@o/ui'
import { AppStore } from './AppStore'
import { LocationStore } from './LocationStore'
import { PaneManagerStore } from './PaneManagerStore'
import { QueryStore } from './QueryStore'
import { ShortcutStore } from './ShortcutStore'
import { SpaceStore } from './SpaceStore'
import { SubPaneStore } from './SubPaneStore'
import { ThemeStore } from './ThemeStore'

export { SelectableStore } from '@o/ui'
export { AppStore } from './AppStore'
export { LocationStore } from './LocationStore'
export { NLPStore } from './NLPStore/NLPStore'
export { PaneManagerStore } from './PaneManagerStore'
export { QueryFilterStore } from './QueryFilterStore'
export { QueryStore } from './QueryStore'
export { ShortcutStore } from './ShortcutStore'
export { SpaceStore } from './SpaceStore'
export { SubPaneStore } from './SubPaneStore'
export { ThemeStore } from './ThemeStore'

export type KitStores = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  queryStore?: QueryStore
  selectableStore?: SelectableStore
  shortcutStore?: ShortcutStore
  themeStore?: ThemeStore
  locationStore?: LocationStore
  spaceStore?: SpaceStore
}
