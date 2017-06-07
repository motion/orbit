import { observer } from 'mobx-react'

export default options => ({
  name: 'observer',
  decorator: Klass => observer(Klass),
})
