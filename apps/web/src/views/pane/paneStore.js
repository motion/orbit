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

  get data() {
    return this.props.data
  }

  get search() {
    return this.props.search
  }

  get state() {
    return this.props.state
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

  selectRow = row => this.props.millerStore.onSelect(this.props.col, row)
}
