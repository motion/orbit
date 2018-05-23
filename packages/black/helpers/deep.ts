export function deep(target, method) {
  if (!method) {
    target.__IS_DEEP = true
    return
  }
  target.__automagical = target.__automagical || {}
  target.__automagical.deep = target.__automagical.deep || {}
  target.__automagical.deep[method] = true
}
