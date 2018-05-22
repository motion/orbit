import global from 'global'
import Mobx from 'mobx'
import { deepObserve } from 'mobx-deep-observer'
import { enableLogging } from 'mobx-logger'

let runners = (global.__mlogRunners = global.__mlogRunners || [])

function deepMobxToJS(_thing) {
  if (!_thing) return _thing
  let thing = Mobx.toJS(_thing)
  if (Array.isArray(thing)) {
    return thing.map(deepMobxToJS)
  }
  if (thing instanceof Object) {
    for (const key of Object.keys(thing)) {
      thing[key] = deepMobxToJS(thing[key])
    }
  }
  return thing
}

let cur

export const mlog = (fn, ...rest) => {
  // regular log
  if (typeof fn !== 'function') {
    cur = fn
    deepObserve(fn, (change, type, path) => {
      if (cur === fn) {
        console.log(change, type, path)
      }
    })
    return console.log(...[fn, ...rest].map(deepMobxToJS))
  }
  const isClass = fn.toString().indexOf('class') === 0
  if (isClass) {
    Object.keys(fn).forEach(key => {
      runners.push(
        Mobx.autorun(() => {
          console.log(fn.constructor.name, key, fn[key])
        }),
      )
    })
    return
  }
  runners.push(
    Mobx.autorun(() => {
      console.log(deepMobxToJS(fn()))
    }),
  )
}

// @ts-ignore
mlog.clear = () => {
  runners.forEach(r => r())
  runners = []
}

let logMobx = false
enableLogging({
  predicate: () => logMobx,
  action: true,
  reaction: true,
  transaction: true,
  compute: true,
})

// @ts-ignore
mlog.enable = () => {
  logMobx = true
}
// @ts-ignore
mlog.disable = () => {
  logMobx = false
}
