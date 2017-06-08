export view from './view'
export store from './store'
export query from './helpers/query'

// use this in @stores to autorun autoruns
export const watch = fn => {
  function temp() {
    return fn()
  }
  temp.autorunme = true
  return temp
}
