export function deep(target, method) {
  target.__automagical = target.__automagical || {}
  target.__automagical.deep = target.__automagical.deep || {}
  target.__automagical.deep[method] = true
}
