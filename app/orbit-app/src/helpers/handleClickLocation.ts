import { NormalizedItem } from './normalizeItem'
import { AppActions } from '../actions/AppActions'

export function handleClickLocation(item: NormalizedItem, e?: Event) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  // simple way for now
  AppActions.queryToggleLocationFilter(item.location)
  // fancy way in the future
  // this.props.searchStore.searchFilterStore.setFilter('location', item.location)
}
