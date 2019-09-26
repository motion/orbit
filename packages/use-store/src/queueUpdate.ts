import { unstable_batchedUpdates } from 'react-dom'

const Updates = new Set<Function>()

let tm = setImmediate(() => {})

const shouldDebug = (level: number = 0) => {
  if (typeof window !== 'undefined' && window['enableLog'] > level) {
    return true
  }
  return false
}

export function queueUpdate(fn: Function) {
  clearImmediate(tm)
  Updates.add(fn)
  tm = setImmediate(() => {
    if (!Updates.size) return
    let next = [...Updates]
    if (__DEV__ && shouldDebug()) {
      console.log('queueUpdate flush', next.map(x => x['__debug_update__']))
    }
    Updates.clear()
    unstable_batchedUpdates(() => {
      for (const cb of next) {
        cb()
      }
    })
  })
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
