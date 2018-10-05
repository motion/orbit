import { ResolvedItem } from '../components/ItemResolver'
import { Actions } from '../actions/Actions'

export function handleClickLocation(item: ResolvedItem, e?: Event) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  // simple way for now
  Actions.queryToggleLocationFilter(item.location)
  // fancy way in the future
  // this.props.searchStore.searchFilterStore.setFilter('location', item.location)
}
