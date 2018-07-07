import * as React from 'react'
import { view } from '@mcro/black'
// import { HighlightsPage } from './HighlightsPage'
import { OrbitPage } from './OrbitPage'
import { PeekPage } from './PeekPage'
import { AppStore } from '~/stores/AppStore'

@view.provide({
  appStore: AppStore,
})
@view
export class MainPage extends React.Component {
  render() {
    return (
      <main>
        {/* <HighlightsPage /> */}
        <OrbitPage />
        <PeekPage />
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
