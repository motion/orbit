export default class PaneStore {
  version = 0
  metaKey = false

  setActions = actions => {
    const { millerState } = this.props
    millerState.setPaneActions(actions)
  }
}
