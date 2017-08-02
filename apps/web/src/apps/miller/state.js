const serialize = content => content
const capitalize = s => s[0].toUpperCase() + s.substr(1)

export default class State {
  activeRow = null
  activeCol = 0
  schema = []
  watchers = {}

  // holds the previously active columns
  prevActiveRows = [0]

  static serialize(content) {
    return new State({ schema: serialize(content) })
  }

  constructor({ schema }) {
    this.schema = schema

    const events = ['selectionChange']
    events.forEach(event => {
      this.watchers[event] = []

      this['on' + capitalize(event)] = cb => {
        this.watchers[event].push(cb)
      }
    })
  }

  setSchema(index, schema) {
    if (this.schema.length < index) {
      this.schema.push(schema)
    } else {
      this.schema[index] = schema
    }
  }

  emit(name) {
    this.watchers[name].forEach(cb => cb())
  }

  moveRow(delta) {
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

  moveCol(delta) {
    if (delta > 0) {
      if (this.schema.length > this.activeCol) {
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
