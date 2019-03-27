// could this optimize?

export function useDefaultProps(a: Object, b: Object) {
  return { ...a, ...b }
}
