import React from 'react'

export type ExtendsReact = React$Component

export default options => ({
  name: 'extends-react',
  decorator: Klass => {
    // functional components
    if (!Klass.prototype) {
      return Klass
    }
    Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
    return Klass
  },
})
