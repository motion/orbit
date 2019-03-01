import { unstable_batchedUpdates } from 'react-dom'

const Updates = new Set()

let tm = null

export function queueUpdate(fn: Function) {
  clearImmediate(tm)
  Updates.add(fn)
  tm = setImmediate(() => {
    let next = [...Updates]
    Updates.clear()
    if (!next.length) return
    unstable_batchedUpdates(() => {
      next.forEach(fn => fn())
    })
  })
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
