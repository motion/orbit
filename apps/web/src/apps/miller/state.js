// @flow
import { sum, range } from 'lodash'

type Schema = {
  title: string,
  type: string,
  category?: string,
  data?: Object,
  icon?: string,
  onSelect?: Function,
  static?: boolean,
}

export default class MillerStateStore {
  activeRow = 0
  activeCol = 0
  refs = []
  schema: Array<Schema> = []
  paneActions = []
  prevActiveRows = [] // holds the previously active columns
  colWidths = range(100).map(() => 0)
  colLeftMargin = 10

  start() {
    this.schema = this.props.schema
  }

  handleSelectionChange = () => {
    const { state } = this.props

    if (state.activeRow !== null && state.activeResults) {
      if (
        state.activeItem &&
        state.activeItem.type &&
        state.activeItem.showChild !== false
      ) {
        state.setSchema(state.activeCol + 1, state.activeItem)
      }
    }
  }

  get translateX() {
    if (this.activeCol === 0) return 0
    return (
      -sum(this.colWidths.slice(0, this.activeCol)) -
      this.colLeftMargin * this.activeCol
    )
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

  get currentItem() {
    return this.schema[this.schema.length - 1]
  }

  get activePlugin() {
    return this.plugins[this.activeCol]
  }

  get activeResults() {
    return this.activePlugin && this.activePlugin.results
  }

  get activeItem() {
    return this.activeResults && this.activeResults[this.activeRow]
  }

  setPaneActions(actions) {
    this.paneActions = actions
  }

  setSchema(index: number, schema: Schema) {
    if (this.schema.length < index) {
      this.schema.push(schema)
    } else {
      this.schema[index] = schema
    }
  }

  setPlugin(index, plugin) {
    this.plugins[index] = plugin
  }

  moveRow(delta: number) {
    if (delta < 0 && this.activeRow === 0) return
    if (this.activeRow === null) {
      this.activeRow = 0
    } else {
      this.activeRow += delta
    }
  }

  removeExcessCols() {
    // clean up old column variables
    this.prevActiveRows = this.prevActiveRows.slice(0, this.activeCol)
    this.schema = this.schema.slice(0, this.activeCol + 1)
  }

  blur() {
    this.activeRow = null
    this.removeExcessCols()
  }

  setSelection(col: number, row: number) {
    if (col > this.activeCol) {
      this.moveCol(1)
    } else {
      this.activeCol = col
    }

    this.activeRow = row
    this.removeExcessCols()
  }

  setActiveRow(row: number) {
    this.setSelection(this.activeCol, row)
  }

  setActiveColumn(col) {
    const lastCol = this.activeCol
    this.paneActions = []
    this.activeCol = col
  }

  moveCol(delta: number) {
    if (delta > 0) {
      if (this.activeCol < this.schema.length - 1) {
        this.prevActiveRows.push(this.activeRow)
        this.setActiveColumn(this.activeCol + delta)
        this.activeRow = 0
      }
    }

    if (delta < 0) {
      if (this.activeCol === 0) return
      this.setActiveColumn(this.activeCol + delta)
      this.activeRow = this.prevActiveRows[this.activeCol]
      this.removeExcessCols()
    }
  }
}
