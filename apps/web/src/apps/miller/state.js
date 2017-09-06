// @flow
const serialize = (_: any): any => _
const capitalize = s => s[0].toUpperCase() + s.substr(1)

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
  static serialize(content) {
    return new MillerStateStore({ schema: serialize(content) })
  }

  plugins = []
  activeRow = 0
  activeCol = 0
  schema: Array<Schema> = []
  watchers = {}
  prevActiveRows = [] // holds the previously active columns

  constructor({ schema }: { schema: Object }) {
    this.schema = schema

    const events = ['selectionChange', 'change', 'changeColumn']
    events.forEach(event => {
      this.watchers[event] = []
      this['on' + capitalize(event)] = cb => {
        this.watchers[event].push(cb)
      }
    })
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

  setSchema(index: number, schema: Schema) {
    if (this.schema.length < index) {
      this.schema.push(schema)
    } else {
      this.schema[index] = schema
    }
  }

  setPlugin(index, plugin) {
    this.plugins[index] = plugin
    this.emit('change', this)
  }

  emit(name: string, ...obj) {
    this.watchers[name].forEach(cb => cb(...obj))
  }

  moveRow(delta: number) {
    if (delta < 0 && this.activeRow === 0) return
    if (this.activeRow === null) {
      this.activeRow = 0
    } else {
      this.activeRow += delta
    }
    this.emit('selectionChange')
  }

  removeExcessCols() {
    // clean up old column variables
    this.prevActiveRows = this.prevActiveRows.slice(0, this.activeCol)
    this.schema = this.schema.slice(0, this.activeCol + 1)
  }

  blur() {
    this.activeRow = null
    this.removeExcessCols()
    this.emit('selectionChange')
  }

  setSelection(col: number, row: number) {
    if (col > this.activeCol) {
      this.moveCol(1)
    } else {
      this.activeCol = col
    }

    this.activeRow = row
    this.removeExcessCols()
    this.emit('selectionChange')
  }

  setActiveRow(row: number) {
    this.setSelection(this.activeCol, row)
  }

  setActiveColumn(col) {
    const lastCol = this.activeCol
    this.activeCol = col
    this.emit('changeColumn', col, lastCol)
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

    this.emit('selectionChange')
  }
}
