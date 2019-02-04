import { Model } from '@mcro/mediator'

export type ModelCacheType = "one"|"many"|"count"

export type ModelCacheEntry = {
  type: ModelCacheType
  query: string
  model: Model<any>
  value: any
  // setValueFns: ((value: any) => any)[]
  removeTimer: number
}

// export type ModelCacheValue = {
//   type: ModelCacheType
//   model: Model<any>
//   id?: any
//   value: any
// }

export const ModelCache = {

  entries: [] as ModelCacheEntry[],
  // values: [] as ModelCacheValue[],

  add(model: Model<any>, type: ModelCacheType, query: any, value: any) {

    // if there is entry remove it, add it to the cache again
    // and create a new entry and store it in the cache
    const entry = this.findEntryByQuery(model, type, query)
    if (entry) {
      entry.value = value
      if (entry.removeTimer)
        clearTimeout(entry.removeTimer)
      // entry.setValueFns.push(setValue)

    } else {
      this.entries.push({
        model,
        type,
        query: JSON.stringify(query || {}),
        value,
        // setValueFns: [setValue]
      })
    }

    /*if (type === 'many') {
      for (let val of value) {
        const id = val.id // note: id is hardcoded here
        const existVal = this.getValueById(model, type, id)
        if (existVal) {
          val = { ...existVal, ...val }
          this.values.splice(this.values.indexOf(existVal), 1)
        } else {
          val = { model, type, id, value: val }
        }
        this.values.push(val)
      }

    } else if (type === 'one') {
      const id = value.id // note: id is hardcoded here
      const existVal = this.getValueById(model, type, id)
      if (existVal) {
        value = { ...existVal, ...value }
        this.values.splice(this.values.indexOf(existVal), 1)
      } else {
        value = { model, type, id, value: value }
      }
      this.values.push(value)
    }*/
  },

  remove(model: Model<any>, type: ModelCacheType, query: any) {
    const entry = this.findEntryByQuery(model, type, query)
    console.log(`removing in 5 seconds`)
    // if (entry.setValueFns.length === 1) {
    if (entry.removeTimer) {
      clearTimeout(entry.removeTimer)
    }
    entry.removeTimer = setTimeout(() => {
        const index = this.entries.indexOf(entry)
        if (index !== -1)
          this.entries.splice(index, 1)
        console.log(`removed from cache!`)
      }, 5000)
    // }
  },

  findEntryByQuery(model: Model<any>, type: ModelCacheType, query: Object) {
    return this.entries.find(entry => {
      return entry.type === type && entry.model === model && entry.query === JSON.stringify(query || {})
    })
  },

  findValueById(model: Model<any>, type: ModelCacheType, id: any) {
    return this.values.find(value => {
      return value.type === type && value.model === model && value.id === id
    })
  }

}
