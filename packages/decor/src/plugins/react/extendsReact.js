// @flow
import React from 'react'

export type ExtendsReact = React$Component

export default () => ({
  name: 'extends-react',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
    return Klass
  },
})
