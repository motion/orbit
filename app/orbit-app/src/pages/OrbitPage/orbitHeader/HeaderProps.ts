import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../../stores/SelectionStore'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'

export type HeaderProps = {
  paneManagerStore?: PaneManagerStore
  queryStore?: QueryStore
  selectionStore?: SelectionStore
}
