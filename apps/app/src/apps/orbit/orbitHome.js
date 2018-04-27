import * as React from 'react'
import { view } from '@mcro/black'
import OrbitHomeContext from './orbitHomeContext'
import { App, Electron } from '@mcro/all'
import OrbitHomeExplore from './orbitHomeExplore'

@view.attach('appStore')
@view
export default class OrbitHome {
  render({ appStore }) {
    const hasQuery = App.state.query
    const isDocked = Electron.orbitState.dockedPinned
    return (
      <orbitHome
        css={{
          opacity: hasQuery ? 0 : 1,
        }}
      >
        <space css={{ height: 10 }} />
        <content if={isDocked}>
          <OrbitHomeExplore appStore={appStore} />
        </content>
        <content if={!isDocked}>
          <OrbitHomeContext appStore={appStore} />
        </content>
        <space css={{ height: 20 }} />
      </orbitHome>
    )
  }

  static style = {
    orbitHome: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: [8, 0, 0],
    },
    content: {
      flex: 1,
    },
  }
}
