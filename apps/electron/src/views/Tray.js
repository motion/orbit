import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import * as Constants from '~/constants'
import Screen from '@mcro/screen'

@view.electron
export default class TrayEl {
  render() {
    return (
      <Tray
        onClick={() => Screen.setState({ shouldPause: Date.now() })}
        image={Path.join(
          Constants.ROOT_PATH,
          'resources',
          'icons',
          'orbitTemplate.png',
        )}
        title={
          Screen.desktopState.paused
            ? 'Paused'
            : Screen.appState.contextMessage || 'Orbit'
        }
      />
    )
  }
}
