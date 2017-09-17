export default class PaneStore {
  selectedIndices = []
  listRef = null
  itemProps = {
    glow: true,
    padding: [10, 10],
    highlightBackground: [0, 0, 0, 0.2],
    highlightColor: [255, 255, 255, 1],
  }

  get actions() {
    return this.state.actions[this.col]
  }

  get state() {
    return this.props.millerStore
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

  setList = ref => {
    if (!this.listRef) {
      this.listRef = ref

      // scroll to row in list
      this.react(() => this.activeIndex, this.listRef.scrollToRow)
    }
  }
}
