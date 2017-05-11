import React from 'react'
import ReactDOM from 'react-dom'
import App from 'models'
import Mobx from 'mobx'
import _m from 'mobx-utils'
import Rx from 'rxjs'
import Router from './router'
import { IS_PROD, DB_CONFIG } from './constants'
import mobxFormatters from 'mobx-formatters'
import _ from 'lodash'
import * as Stores from '~/stores'
import * as Constants from '~/constants'
import { view } from '~/helpers'

if (!IS_PROD) {
  // install console formatters
  // mobxFormatters(Mobx)
  // dev helpers
  window.React = React
  window.App = App
  window.Constants = Constants
  window.Router = Router
  window.Mobx = Mobx
  window.Rx = Rx
  window._m = _m
  window._ = _
}

const root = document.querySelector('#app')

@view class Splash {
  time = Rx.Observable.timer(0, 16).take(30000)

  render() {
    return <loader $$draggable $at={this.time} />
  }

  static style = {
    loader: {
      width: '100%',
      height: '100%',
      backgroundImage: 'url(https://grasshoppermind.files.wordpress.com/2012/05/five-lined-pyramids.jpg)',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      filter: 'contrast(100%) brightness(1)',
    },
    at: time => ({
      filter: `contrast(${100 + time * 2}%) brightness(${1 + 0.1 * time})`,
    }),
  }
}

ReactDOM.render(<Splash />, root)

function render() {
  const Root = require('./root').default
  ReactDOM.render(<Root />, root)
}

export function start() {
  App.start(DB_CONFIG, Stores).then(render)
}

if (module.hot) {
  module.hot.accept('./root', render)
  module.hot.accept('./router', render)
}

start()
