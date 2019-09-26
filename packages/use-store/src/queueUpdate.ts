import { unstable_batchedUpdates } from 'react-dom'

const Updates = new Set<Function>()

let tm: any = null

const shouldDebug = (level: number = 0) => {
  if (typeof window !== 'undefined' && window['enableLog'] > level) {
    return true
  }
  return false
}

export function queueUpdate(fn: Function) {
  clearTimeout(tm)
  Updates.add(fn)
  tm = setTimeout(() => {
    if (!Updates.size) return
    let next = [...Updates]
    if (process.env.NODE_ENV === 'development' && shouldDebug()) {
      console.log('queueUpdate flush', next.map(x => x['__debug_update__']))
    }
    Updates.clear()
    unstable_batchedUpdates(() => {
      for (const cb of next) {
        cb()
      }
    })
  }, 0)
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
