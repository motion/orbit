import { react } from '@mcro/black'

// keeps last state until this pane is active
export function stateOnlyWhenActive(store) {
  return react(
    () => store.props.searchStore.searchState,
    state => {
      if (!store.isActive) {
        throw react.cancel
      }
      return state
    },
    { log: false, immediate: true, defaultValue: {} },
  )
}
