import { SelectionStore } from '@o/ui'
import { AppsStore } from './AppsStore'
import { AppStore } from './AppStore'
import { LocationStore } from './LocationStore'
import { PaneManagerStore } from './PaneManagerStore'
import { QueryStore } from './QueryStore'
import { ShortcutStore } from './ShortcutStore'
import { SpaceStore } from './SpaceStore'
import { SubPaneStore } from './SubPaneStore'
import { ThemeStore } from './ThemeStore'

export { SelectionStore } from '@o/ui'
export { AppsStore } from './AppsStore'
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
  selectionStore?: SelectionStore
  shortcutStore?: ShortcutStore
  themeStore?: ThemeStore
  locationStore?: LocationStore
  spaceStore?: SpaceStore
  appsStore?: AppsStore
}
