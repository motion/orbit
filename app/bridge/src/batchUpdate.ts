import { unstable_batchedUpdates } from 'react-dom'

const Updates = new Set<Function>()

let tm = setTimeout(() => {}, 0)

export function queueUpdate(fn: Function) {
  clearTimeout(tm)
  Updates.add(fn)
  tm = setTimeout(() => {
    if (!Updates.size) return
    let next = [...Updates]
    Updates.clear()
    unstable_batchedUpdates(() => {
      next.forEach(cb => cb())
    })
  }, 0)
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
