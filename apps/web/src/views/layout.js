// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import NotFound from '~/views/404'
import Router from '~/router'

@view
export default class Layout {
  render() {
    const CurrentPage = Router.activeView || NotFound
    console.log('@@', Router.key, Router.path)
    return <CurrentPage key={Router.key} {...Router.params} />
  }

  static style = {
    hide: {
      opacity: 0,
      pointerEvents: 'none',
    },
  }
}
