const global = require('global')
const Mobx = require('mobx')

let runners = (global.__mlogRunners = global.__mlogRunners || [])

function deepMobxToJS(_thing) {
  let thing = _thing
  if (thing && thing.toJS) {
    thing = thing.toJS()
  }
  if (Array.isArray(thing)) {
    return thing.map(deepMobxToJS)
  }
  if (thing && typeof thing === 'object') {
    return Object.keys(thing).reduce(
      (acc, cur) =>
        Object.assign(acc, {
          [cur]: deepMobxToJS(thing[cur]),
        }),
      {},
    )
  }
  return thing
}

global.mlog = (fn, ...rest) => {
  // regular log
  if (typeof fn !== 'function') {
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
      console.log(fn())
    }),
  )
}
global.mlog.clear = () => {
  runners.forEach(r => r())
  runners = []
}
