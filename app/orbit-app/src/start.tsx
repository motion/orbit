import '../public/styles/base.css'
import '../public/styles/nucleo.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import './RootViewHMR'
import { Router } from '@mcro/router'
import { OrbitPage } from './pages/OrbitPage/OrbitPage'
import { AppPage } from './pages/AppPage/AppPage'
import { HighlightsPage } from './pages/HighlightsPage/HighlightsPage'
import { IsolatePage } from './pages/IsolatePage'

const router = new Router({
  routes: {
    '/': OrbitPage,
    '/app': AppPage,
    '/highlights': HighlightsPage,
    '/isolate': IsolatePage,
  },
})

export async function start() {
  // re-require for hmr to capture new value
  const { RootView } = require('./RootViewHMR')
  // Root is the topmost store essentially
  // We export it so you can access a number of helpers
  if (!window['Root']) {
    console.timeEnd('splash')
    const { RootStore } = require('./stores/RootStore')
    const rootStore = new RootStore()
    window['Root'] = rootStore
    rootStore.rootView = RootView
  }
  ReactDOM.render(<RootView router={router} />, document.querySelector('#app'))
}

start()

if (process.env.NODE_ENV !== 'production') {
  if (typeof module.hot !== 'undefined') {
    module.hot.accept(start)
  }
}
