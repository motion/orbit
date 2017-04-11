import React from 'react'
import { Provide } from 'helpers'
import { render } from 'react-dom'
import App from './stores/app'

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
