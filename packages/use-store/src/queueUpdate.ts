import { unstable_batchedUpdates } from 'react-dom'

const Updates = new Set<Function>()

let tm = setImmediate(() => {})

const shouldDebug = () => {
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
    if (process.env.NODE_ENV === 'development' && shouldDebug()) {
      console.log('queueUpdate flush', next.map(x => x['__debug_update__']))
    }
    Updates.clear()
    unstable_batchedUpdates(() => {
      next.forEach(cb => cb())
    })
  })
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
