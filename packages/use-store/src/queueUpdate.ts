import { unstable_batchedUpdates } from 'react-dom'

const Updates = new Set()

let tm = null

export function queueUpdate(fn: Function) {
  clearImmediate(tm)
  Updates.add(fn)
  tm = setImmediate(() => {
    if (!Updates.size) return
    unstable_batchedUpdates(() => {
      ;[...Updates].forEach(fn => fn())
    })
    Updates.clear()
  })
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
