// @flow
import { sum, range, memoize } from 'lodash'

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
  paneRefs = []
  schema: Array<Schema> = [{ type: 'main', data: { prefix: '' } }]
  paneActions = []
  prevActiveRows = [] // holds the previously active columns
  colWidths = range(100).map(() => 0)
  colLeftMargin = 10

  keyActions = {
    right: () => {
      this.moveCol(1)
    },
    down: () => {
      if (
        this.activeRow === null ||
        (this.activeResults && this.activeRow < this.activeResults.length - 1)
      ) {
        this.moveRow(1)
      }
    },
    up: () => {
      this.moveRow(-1)
    },
    left: () => {
      this.moveCol(-1)
    },
    esc: () => {},
    cmdA: () => {},
    cmdEnter: () => {},
    enter: () => {},
  }

  start() {
    this.watch(() => {
      if (this.activeRow !== null && this.activeResults) {
        if (
          this.activeItem &&
          this.activeItem.type &&
          this.activeItem.showChild !== false
        ) {
          this.setSchema(this.activeCol + 1, this.activeItem)
        }
      }
    })
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

  handleRef = memoize(index => ref => {
    this.setRef(index, ref)
  })

  setRef(index, ref) {
    this.refs[index] = ref
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

  moveCol(delta: number) {
    if (delta > 0) {
      if (this.activeCol < this.schema.length - 1) {
        this.prevActiveRows.push(this.activeRow)
        this.activeCol = this.activeCol + delta
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

  get translateX() {
    if (this.activeCol === 0) return 0
    return (
      -sum(this.colWidths.slice(0, this.activeCol)) -
      this.colLeftMargin * this.activeCol
    )
  }

  get currentItem() {
    return this.schema[this.schema.length - 1]
  }

  get activeRef() {
    return this.paneRefs[this.activeCol]
  }

  get activeResults() {
    return this.activeRef && this.activeRef.results
  }

  get activeItem() {
    return this.activeResults && this.activeResults[this.activeRow]
  }
}
