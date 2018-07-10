import { react } from '@mcro/black'

// keeps last state until this pane is active
export function stateOnlyWhenActive(store) {
  return react(
    () => store.props.appStore.searchState,
    state => {
      if (!store.isActive) {
        throw react.cancel
      }
      return state
    },
    { immediate: true, defaultValue: {} },
  )
}
