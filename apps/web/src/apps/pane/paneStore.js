export default class PaneStore {
  listRef = null

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
