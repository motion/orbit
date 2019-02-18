const Updates = new Set()

let tm = null

export function queueUpdate(fn: Function) {
  clearImmediate(tm)
  Updates.add(fn)
  tm = setImmediate(() => {
    if (!Updates.size) return
    ;[...Updates].forEach(fn => fn())
    Updates.clear()
  })
}

export function removeUpdate(fn: Function) {
  Updates.delete(fn)
}
