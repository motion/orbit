import { observer } from 'mobx-react'

export default options => ({
  name: 'observer',
  decorator: Klass => {
    if (!Klass.prototype) {
      return Klass
    }
    return observer(Klass)
  },
})
