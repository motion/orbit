export default class PaneStore {
  selectedIndices = []
  listRef = null
  itemProps = {
    glow: true,
    padding: [10, 10],
    highlightBackground: [0, 0, 0, 0.15],
    highlightColor: [255, 255, 255, 1],
  }

  get miller() {
    return this.props.millerStore
  }

  get actions() {
    return this.miller.actions[this.col]
  }

  get col() {
    return this.props.index
  }

  get data() {
    return this.props.data
  }

  get isActive() {
    return !this.miller.activeAction && this.miller.activeCol == this.col
  }

  get highlightIndex() {
    return !this.isActive && this.miller.prevActiveRows[this.col]
  }

  get activeIndex() {
    return this.isActive && this.miller.activeRow
  }

  selectRow = row => this.miller.setSelection(this.col, row)
  onSelect = row => this.props.millerStore.setSelection(this.props.index, row)

  setResults = results => {
    this.props.millerStore.setResults(this.props.index, results)
  }

  setList = ref => {
    if (!this.listRef) {
      this.listRef = ref

      // scroll to row in list
      this.react(
        () => this.activeIndex,
        row => {
          if (this.isActive) {
            this.listRef.scrollToRow(row)
          }
        }
      )
    }
  }
}
