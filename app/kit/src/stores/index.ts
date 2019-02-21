import { SelectionStore } from '@mcro/ui'
import { AppStore } from './AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { QueryStore } from './QueryStore'
import { ShortcutStore } from './ShortcutStore'
import { SubPaneStore } from './SubPaneStore'

export { SelectionStore } from '@mcro/ui'
export { AppStore } from './AppStore'
export { PaneManagerStore } from './PaneManagerStore'
export { QueryStore } from './QueryStore'
export { ShortcutStore } from './ShortcutStore'
export { SubPaneStore } from './SubPaneStore'

export type KitStores = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  queryStore?: QueryStore
  selectionStore?: SelectionStore
  sourcesStore?: any
  shortcutStore?: ShortcutStore
}
