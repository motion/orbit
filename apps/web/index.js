import { render } from 'react-dom'
import React from 'react'

window.regeneratorRuntime = require('regenerator-runtime')

const App = require('./stores/app').default
const Router = require('./stores/router').default

window.React = React
window.App = App
window.Router = Router

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
