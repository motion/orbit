// @flow
const serialize = content => content
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
  prevActiveRows = [0] // holds the previously active columns

  constructor({ schema }) {
    this.schema = schema

    const events = ['selectionChange', 'change']
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

  get activeBar() {
    return this.activePlugin && this.activePlugin.barContents
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

  setSchema(index, schema: Schema) {
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

  emit(name, obj) {
    this.watchers[name].forEach(cb => cb(obj))
  }

  moveRow(delta) {
    if (delta < 0 && this.activeRow === 0) return
    if (this.activeRow === null) {
      this.activeRow = 0
    } else {
      this.activeRow += delta
    }
    console.log('new row is', this.activeRow)
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

  setSelection(col, row) {
    if (col > this.activeCol) {
      this.moveCol(1)
    } else {
      this.activeCol = col
    }

    this.activeRow = row
    this.removeExcessCols()
    this.emit('selectionChange')
  }

  setActiveRow(row) {
    this.setSelection(this.activeCol, row)
  }

  moveCol(delta) {
    if (delta > 0) {
      if (this.schema.length - 1 > this.activeCol) {
        this.prevActiveRows.push(this.activeRow)
        this.activeCol += delta
        this.activeRow = 0
      }
    }

    if (delta < 0) {
      if (this.activeCol === 0) return
      this.activeCol += delta
      this.activeRow = this.prevActiveRows[this.activeCol]
      this.removeExcessCols()
    }

    this.emit('selectionChange')
  }
}
