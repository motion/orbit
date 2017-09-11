export default class PaneStore {
  version = 0
  metaKey = false

  setActions = actions => {
    const { millerStore } = this.props
    millerStore.state.setPaneActions(actions)
  }
}
