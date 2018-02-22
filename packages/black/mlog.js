const global = require('global')
const Mobx = require('mobx')

let runners = (global.__mlogRunners = global.__mlogRunners || [])

function deepMobxToJS(_thing) {
  let thing = Mobx.toJS(_thing)
  if (!thing) return thing
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
