export * from 'mobx'

export view from './view'
export store from './store'

export Model from './model/model'
export query from './model/query'
export * from './model/properties'

// use this in @stores to autorun autoruns
export const watch = fn => {
  function temp() {
    return fn()
  }
  temp.autorunme = true
  return temp
}
