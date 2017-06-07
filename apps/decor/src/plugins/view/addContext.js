// TODO THIS COULD BE GENERIC CONTEXT PLUGIN ONCE OPTIONS WORKS
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
