// @flow
import * as React from 'react'

export type ExtendsReact = React$Component<any, any, any>

export default () => ({
  name: 'extends-react',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    if (!Klass.prototype.isReactComponent) {
      Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
    }
  },
})
