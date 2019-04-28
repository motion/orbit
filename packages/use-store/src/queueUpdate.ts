import { unstable_batchedUpdates } from 'react-dom'

const Updates = new Set<Function>()

let tm = setImmediate(() => {})

export function queueUpdate(fn: Function) {
  clearImmediate(tm)
  Updates.add(fn)
  tm = setImmediate(() => {
    if (!Updates.size) return
    let next = [...Updates]
    Updates.clear()
    unstable_batchedUpdates(() => {
      next.forEach(cb => cb())
    })
  })
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
