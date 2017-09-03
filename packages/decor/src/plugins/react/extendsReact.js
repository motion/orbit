// @flow
import * as React from 'react'

export opaque type ExtendsReact = React$Component<any, any, any>

export default () => ({
  name: 'extends-react',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
    return Klass
  },
})
