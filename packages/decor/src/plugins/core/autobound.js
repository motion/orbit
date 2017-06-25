import autobind from 'autobind-decorator'

export default options => ({
  name: 'autobind',
  decorator: Klass => {
    if (!Klass.prototype) {
      return Klass
    }
    return autobind(Klass)
  },
})
