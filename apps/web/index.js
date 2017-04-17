import 'babel-polyfill'
import { render } from 'react-dom'
import React from 'react'
import App from 'models'
import mobx from 'mobx'
import Router from '~/router'

window.React = React
window.App = App
window.Router = Router
window.mobx = mobx

App.connect()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      module.hot.accept()
    }

    const Root = require('./views/root').default

    render(
      <Root />,
      document.querySelector('#app')
    )
  })
