import React from 'react'
import { inject } from 'motion-view'
import { render } from 'react-dom'
import App from './stores/app'
import Router from './stores/router'

window.React = React

App.connect()
  .then(() => {
    inject({
      app: App,
      router: Router,
    })

    if (process.env.NODE_ENV === 'development') {
      window.App = App
      module.hot.accept()
    }

    // render
    const Views = require('./views').default
    render(
      <Views />,
      document.querySelector('#app')
    )
  })
