import root from 'global'
import * as Mobx from 'mobx'
import { enableLogging } from 'mobx-logger'

let runners = (root.__mlogRunners = root.__mlogRunners || [])

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

type MLog = {
  (fn: Function, ...rest: Array<any>): void
  clear: Function
  enable: Function
  disable: Function
}

export const mlog = <MLog>function mlog(fn) {
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

mlog.enable = () => {
  logMobx = true
}
mlog.disable = () => {
  logMobx = false
}
