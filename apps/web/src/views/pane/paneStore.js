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

  get actions() {
    return this.state.actions[this.col]
  }

  get state() {
    return this.props.millerState
  }

  get col() {
    return this.props.index
  }

  get data() {
    return this.props.data
  }

  get isActive() {
    return !this.state.activeAction && this.state.activeCol == this.col
  }

  get highlightIndex() {
    return !this.isActive && this.state.prevActiveRows[this.col]
  }

  get activeIndex() {
    return this.isActive && this.state.activeRow
  }

  selectRow = row => this.state.setSelection(this.col, row)
}
