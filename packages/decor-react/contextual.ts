export function contextual(options) {
  return {
    name: 'addContext',
    once: true,
    decorator: Klass => {
      Klass.contextTypes = {
        ...Klass.contextTypes,
        ...options,
      }
      return Klass
    },
  }
}
