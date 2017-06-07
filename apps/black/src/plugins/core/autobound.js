import autobind from 'autobind-decorator'

export default options => ({
  name: 'autobind',
  decorator: Klass => autobind(Klass),
})
