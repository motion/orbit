import { SelectionStore } from '@mcro/ui'
import { AppStore } from './AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { QueryStore } from './QueryStore'
import { SettingStore } from './SettingStore'
import { ShortcutStore } from './ShortcutStore'
import { SpaceStore } from './SpaceStore'
import { SubPaneStore } from './SubPaneStore'
import { ThemeStore } from './ThemeStore'

export { SelectionStore } from '@mcro/ui'
export { AppStore } from './AppStore'
export { NLPStore } from './NLPStore/NLPStore'
export { PaneManagerStore } from './PaneManagerStore'
export { QueryFilterStore } from './QueryFilterStore'
export { QueryStore } from './QueryStore'
export { SettingStore } from './SettingStore'
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
  sourcesStore?: any
  shortcutStore?: ShortcutStore
  themeStore?: ThemeStore
  spaceStore?: SpaceStore
  settingStore?: SettingStore
}
