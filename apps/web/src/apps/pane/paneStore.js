export default class PaneStore {
  listRef = null

  setList = ref => {
    if (!this.listRef) {
      this.listRef = ref

      const { sidebar, stack } = this.props

      // scroll to row in list
      this.react(
        () =>
          sidebar
            ? stack.last.sidebarSelectedIndex
            : stack.last.mainSelectedIndex,
        index => {
          this.listRef.scrollToRow(index)
        }
      )
    }
  }
}
