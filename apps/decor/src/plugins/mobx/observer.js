import { observer } from 'mobx-react'

export default options => ({
  decorator: Klass => {
    if (!Klass.prototype) {
      return Klass
    }
    return observer(Klass)
  },
})
