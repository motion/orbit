import { AppStore } from '../stores/AppStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { SubPaneStore } from '../stores/SubPaneStore'

export type UIStores = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
}
