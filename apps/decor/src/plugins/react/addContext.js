export default options => ({
  name: 'addContext',
  decorator: Klass => {
    Klass.contextTypes = {
      ...Klass.contextTypes,
      ...options,
    }
    return Klass
  },
})
