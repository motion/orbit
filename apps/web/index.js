import 'babel-polyfill'
import { render } from 'react-dom'
import React from 'react'
import { App } from 'stores'

window.React = React
window.App = App
window.Router = require('~/router')

App.connect()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      module.hot.accept()
    }

    const Root = require('./root').default

    render(
      <Root />,
      document.querySelector('#app')
    )
  })
