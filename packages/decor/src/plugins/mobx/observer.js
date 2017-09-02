import { observer } from 'mobx-react'

export default () => ({
  name: 'observer',
  once: true,
  onlyClass: true,
  decorator: Klass => {
    return observer(Klass)
  },
})
