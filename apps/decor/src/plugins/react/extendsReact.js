import { Component } from 'react'

export default options => ({
  name: 'extends-react',
  decorator: Klass => {
    // functional components
    if (!Klass.prototype) {
      return Klass
    }
    Object.setPrototypeOf(Klass.prototype, Component.prototype)
    return Klass
  },
})
