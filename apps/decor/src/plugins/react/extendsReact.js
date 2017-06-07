import { Component } from 'react'

export default options => ({
  name: 'extends-react',
  decorator: Klass => {
    Object.setPrototypeOf(Klass.prototype, Component.prototype)
  },
})
