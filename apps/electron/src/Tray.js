import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import * as Constants from '~/constants'

@view.attach('rootStore')
@view.electron
export default class TrayEl {
  render({ rootStore, ...props }) {
    return (
      <Tray
        image={Path.join(
          Constants.ROOT_PATH,
          'resources',
          'icons',
          'orbitTemplate.png',
        )}
        title={
          rootStore.screen.swiftBridge.state.isPaused
            ? 'Paused'
            : rootStore.screen.appState.contextMessage || 'Orbit'
        }
        {...props}
      />
    )
  }
}
