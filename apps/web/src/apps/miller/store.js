// @flow
import { actionToKeyCode } from './helpers'
import { sum, range, find, includes, flatten } from 'lodash'
import type { PaneResult } from '~/types'

type Schema = {
  title?: string,
  type: string,
  category?: string,
  data?: Object,
  icon?: string,
  onSelect?: Function,
  static?: boolean,
}

export default class MillerStore {
  activeRow = 0
  activeCol = 0
  paneResults: Array<Function> = []
  schema: Array<Schema> = [{ type: 'main', data: { prefix: '' } }]
  paneActions = []
  prevActiveRows = [] // holds the previously active columns
  paneWidths = range(100).map(() => 0)
  paneLeftMargin = 10
  metaKey = false

  activeAction = null

  keyActions = {
    right: () => {
      if (this.activeAction) return
      this.moveCol(1)
    },
    down: () => {
      if (this.activeAction) return
      if (
        this.activeRow === null ||
        (this.activeResults && this.activeRow < this.activeResults.length - 1)
      ) {
        this.moveRow(1)
      }
    },
    up: () => {
      if (this.activeAction) return
      this.moveRow(-1)
    },
    left: () => {
      if (this.activeAction) return
      this.moveCol(-1)
    },
    esc: () => {
      console.log('esc')
    },
    cmdA: () => {},
    cmdEnter: () => {},
    enter: () => {},
  }

  textboxRef = null
  isTextbox = ({ target }) => {
    return (
      (this.inputRef && target.className !== this.inputRef.className) ||
      includes(['input', 'textarea'], target.tagName.toLowerCase())
    )
  }

  willMount() {
    let lastCol = null
    this.react(
      () => this.activeItem,
      () => {
        if (
          this.activeItem &&
          this.activeItem.type &&
          this.activeItem.showChild !== false
        ) {
          const run = () => this.setSchema(this.activeCol + 1, this.activeItem)

          // if we're not moving cols, setTimeout to improve highlight speeds
          if (lastCol === this.activeCol) {
            this.setTimeout(run)
          } else {
            run()
          }
        }
        lastCol = this.activeCol
      }
    )

    this.on(window, 'keydown', e => {
      this.metaKey = e.metaKey

      if (!this.isTextbox(e)) {
        this.activeActions.forEach(action => {
          if (actionToKeyCode(action) === e.keyCode) {
            e.preventDefault()
            this.runAction(action.name)
          }
        })
      }
    })

    this.on(window, 'keyup', e => {
      this.metaKey = e.metaKey
    })
  }

  setPaneWidth = (index, width) => {
    this.paneWidths[index] = width
  }

  setPaneActions(index, actions) {
    this.paneActions[index] = actions
    this.paneActions = [...this.paneActions]
  }

  setSchema(index: number, schema: Schema) {
    if (this.schema[index] && this.schema[index].id === schema.id) return
    if (this.schema.length < index) {
      this.schema = [...this.schema, schema]
    } else {
      this.schema[index] = schema
    }

    this.schema = [...this.schema]
  }

  setResults = (index: number, results: Array<PaneResult>) => {
    this.paneResults[index] = results
    this.paneResults = [...this.paneResults]
  }

  runAction = name => {
    if (this.activeAction && this.activeAction.name === name) {
      this.activeAction = null
    } else {
      this.activeAction =
        find(this.activeActions || [], action => action.name === name) || null
    }
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
    return
    // clean up old column variables
    this.prevActiveRows = this.prevActiveRows.slice(0, this.activeCol)
    this.schema = this.schema.slice(0, this.activeCol + 1)
  }

  blur() {
    this.activeRow = null
    this.removeExcessCols()
  }

  setSelection(col: number, row: number) {
    if (col === this.activeCol && row === this.activeRow) return
    if (col > this.activeCol) {
      this.moveCol(1)
    } else {
      this.activeCol = col
    }

    this.activeRow = row
    this.removeExcessCols()
  }

  setActiveCol(col: number) {
    this.setSelection(col, this.activeRow)
  }

  setActiveRow(row: number) {
    this.setSelection(this.activeCol, row)
  }

  setActiveAction(action) {
    this.activeAction = action
  }

  moveCol(delta: number) {
    if (delta > 0) {
      if (this.activeCol < this.schema.length - 1) {
        this.prevActiveRows.push(this.activeRow)
        this.activeCol = this.activeCol + delta
        this.setActiveRow(0)
      }
    }

    if (delta < 0) {
      if (this.activeCol === 0) return
      this.activeCol = this.activeCol + delta
      this.setActiveRow(this.prevActiveRows[this.activeCol])
      // this.removeExcessCols()
    }
  }

  get translateX() {
    if (this.activeCol === 0) return 0
    return (
      -sum(this.paneWidths.slice(0, this.activeCol)) -
      this.paneLeftMargin * this.activeCol
    )
  }

  get currentItem() {
    return this.schema[this.schema.length - 1]
  }

  get activeResults() {
    if (this.paneResults[this.activeCol]) {
      return this.paneResults[this.activeCol]()
    }
  }

  get activeItem() {
    return this.activeResults && this.activeResults[this.activeRow]
  }

  get activeActions() {
    // currently allows actions for all panes

    // comment this out to only allow the currently selected pane
    // return this.paneActions[this.activeCol] || []

    return flatten(this.paneActions.map(xs => xs || []))
  }
}
