import { AppStore } from '../stores/AppStore'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { QueryStore } from '../stores/QueryStore'
import { SubPaneStore } from '../stores/SubPaneStore'

export type KitStores = {
  appStore?: AppStore
  paneManagerStore?: PaneManagerStore
  subPaneStore?: SubPaneStore
  queryStore?: QueryStore
}
