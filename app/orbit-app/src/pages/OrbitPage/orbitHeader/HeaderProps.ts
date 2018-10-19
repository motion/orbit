import { SearchStore } from '../orbitDocked/SearchStore'
import { PaneManagerStore } from '../PaneManagerStore'
import { QueryStore } from '../orbitDocked/QueryStore'
import { SelectionStore } from '../orbitDocked/SelectionStore'

export type HeaderProps = {
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  queryStore?: QueryStore
  selectionStore?: SelectionStore
}
