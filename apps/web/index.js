import 'babel-polyfill'
import { render } from 'react-dom'
import React from 'react'
import { App } from 'stores'

window.React = React
window.App = App

App.connect()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      module.hot.accept()
    }

    const Views = require('./views').default

    render(
      <Views />,
      document.querySelector('#app')
    )
  })
