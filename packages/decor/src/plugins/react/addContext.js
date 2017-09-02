export default options => ({
  name: 'addContext',
  once: true,
  decorator: Klass => {
    Klass.contextTypes = {
      ...Klass.contextTypes,
      ...options,
    }
    return Klass
  },
})
