export default class PaneStore {
  itemProps = {
    size: 1.2,
    glow: false,
    hoverable: true,
    fontSize: 26,
    padding: [10, 10],
    highlightBackground: [0, 0, 0, 0.2],
    highlightColor: [255, 255, 255, 1],
  }

  selectedIndices = []

  get millerStore() {
    return this.props.millerStore
  }

  get state() {
    this.props.millerStore.stateVersion
    return this.props.millerStore.state
  }

  get data() {
    return this.props.data
  }

  get search() {
    return this.millerStore.paneProps.search || ''
  }

  get isActive() {
    return this.state.activeCol == this.props.col
  }

  get highlightIndex() {
    return !this.isActive && this.state.prevActiveRows[this.props.col]
  }

  get activeIndex() {
    return this.isActive && this.state.activeRow
  }

  selectRow = row => this.millerStore.onSelect(this.props.col, row)
}
