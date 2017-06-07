export { view } from './view'
export { store } from './store'

// use this in @stores to autorun autoruns
export const watch = fn => {
  function temp() {
    return fn()
  }
  temp.autorunme = true
  return temp
}
