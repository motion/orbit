import * as React from 'react'
import { view } from '@mcro/black'
import Highlights from './highlights/highlights'
import Orbit from './orbit/orbit'
import Peek from './peek/peek'
import AppStore from '~/stores/appStore'

@view.provide({
  appStore: AppStore,
})
@view
export default class OrbitMain {
  render() {
    return (
      <main>
        <Highlights />
        <Orbit />
        <Peek />
      </main>
    )
  }

  static style = {
    main: {
      // background: [0, 0, 0, 0.1],
      maxWidth: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      userSelect: 'none',
      position: 'relative',
    },
  }
}
