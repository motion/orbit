import { view } from '../view'

const simpleObject = storeSet => {
  const res = {}
  for (const fn of [...storeSet]) {
    const key = fn.constructor.name
    if (res[key]) {
      if (Array.isArray(res[key])) {
        res[key].push(fn)
      } else {
        // convert to array if more than one
        res[key] = [res[key], fn]
      }
    } else {
      res[key] = fn
    }
  }
  return res
}

// allows easy tracking of all views/stores
export function debugState(callback) {
  if (typeof callback !== 'function') {
    throw new Error('debugState requires a callback')
  }

  const stores = new Set()
  const views = new Set()

  const sendUpdate = () =>
    callback({
      stores: simpleObject(stores),
      views: simpleObject(views),
    })

  let tm
  const update = () => {
    clearTimeout(tm)
    tm = setTimeout(sendUpdate, 100)
  }

  const mount = set => ({ thing }) => {
    set.add(thing)
    update()
  }

  const unmount = set => ({ thing }) => {
    set.delete(thing)
    update()
  }

  view.on('store.mount', mount(stores))
  view.on('store.unmount', unmount(stores))
  view.provide.on('store.mount', mount(stores))
  view.provide.on('store.unmount', unmount(stores))
  view.on('view.mount', mount(views))
  view.on('view.unmount', unmount(views))

  // send first one right away
  sendUpdate()
}
