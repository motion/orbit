import { sum, range } from 'lodash'

export default class MillerStore {
  colWidths = range(100).map(() => 0)
  paneWidth = null
  colLeftMargin = 10
  paneProps = {}

  start() {
    this.props.state.onSelectionChange(this.handleSelectionChange)
    this.props.state.onChange(this.props.onChange)
    this.setTimeout(this.handleSelectionChange)
    if (this.props.getRef) {
      this.props.getRef(this)
    }
  }

  setPaneProps = props => {
    this.paneProps = { ...this.paneProps, ...props }
  }

  handleSelectionChange = () => {
    const { state, onChange } = this.props

    if (state.activeRow !== null && state.activeResults) {
      if (
        state.activeItem &&
        state.activeItem.type &&
        state.activeItem.showChild !== false
      ) {
        state.setSchema(state.activeCol + 1, state.activeItem)
      }
    }
    onChange(state)
  }

  setWidth = (index, width) => {
    this.colWidths[index] = width
  }

  get translateX() {
    const { state } = this.props
    if (state.activeCol === 0) return 0
    return (
      -sum(this.colWidths.slice(0, state.activeCol)) -
      this.colLeftMargin * state.activeCol
    )
  }

  onSelect(col, row) {
    const { state } = this.props
    state.setSelection(col, row)
  }

  keyActions = {
    right: () => {
      const { state } = this.props
      state.moveCol(1)
    },
    down: () => {
      const { state } = this.props
      if (
        state.activeRow === null ||
        (state.activeResults &&
          state.activeRow < state.activeResults.length - 1)
      ) {
        state.moveRow(1)
      }
    },
    up: () => {
      const { state } = this.props
      state.moveRow(-1)
    },
    left: () => {
      const { state } = this.props
      state.moveCol(-1)
    },
    esc: () => {},
    cmdA: () => {},
    cmdEnter: () => {},
    enter: () => {},
  }
}
