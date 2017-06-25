// @flow
import React from 'react'

export type ExtendsReact = React$Component

export default (options: Object) => ({
  name: 'extends-react',
  decorator: (Klass: Class<any> | Function) => {
    // functional components
    if (!Klass.prototype) {
      return Klass
    }
    Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
    return Klass
  },
})
