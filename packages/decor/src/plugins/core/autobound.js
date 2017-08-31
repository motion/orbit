import autobind from 'autobind-decorator'

export default () => ({
  name: 'autobind',
  once: true,
  onlyClass: true,
  decorator: Klass => {
    return autobind(Klass)
  },
})
