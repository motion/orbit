import { react } from '@mcro/black'
import { stateOnlyWhenActive } from './stateOnlyWhenActive'
import { App } from '@mcro/stores'

export class OrbitSearchStore {
  // this isn't a computed val because it persists the last state
  state = stateOnlyWhenActive(this)

  get isActive() {
    return this.props.appStore.selectedPane === this.props.name
  }

  hasQuery() {
    return !!App.state.query
  }

  // delay just a tiny bit to prevent input delay
  currentQuery = react(() => App.state.query, _ => _, { delay: 32 })
}
