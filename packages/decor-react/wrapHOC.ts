export function wrapHOC({ wrapper }) {
  return {
    name: 'wrapHOC',
    once: true,
    decorator: Klass => {
      // ensures static methods go through
      const wrappedView = wrapper(Klass)
      wrappedView._isHOC = true
      return new Proxy(wrappedView, {
        set(_, method, value) {
          Klass[method] = value
          return true
        },
      })
    },
  }
}
