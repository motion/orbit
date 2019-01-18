import { AppActions } from '../actions/AppActions'
import { NormalItem } from './normalizeItem'

export function handleClickLocation(item: NormalItem, e?: Event) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  // simple way for now
  AppActions.queryToggleLocationFilter(item.location)
  // fancy way in the future
  // this.props.searchStore.searchFilterStore.setFilter('location', item.location)
}
