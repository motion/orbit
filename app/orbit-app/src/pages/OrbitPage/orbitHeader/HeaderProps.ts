import { SearchStore } from '../../../stores/SearchStore'
import { PaneManagerStore } from '../PaneManagerStore'
import { QueryStore } from '../../../stores/QueryStore'
import { SelectionStore } from '../../../stores/SelectionStore'

export type HeaderProps = {
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  queryStore?: QueryStore
  selectionStore?: SelectionStore
}
