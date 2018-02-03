import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import * as Constants from '~/constants'

class TrayStore {
  get rootStore() {
    return this.props.rootStore
  }

  willMount() {
    this.watch(() => {
      // console.log('got new oraState', this.rootStore.oraState)
    })
  }
}

@view.attach('rootStore')
@view.provide({
  trayStore: TrayStore,
})
@view.electron
export default class TrayEl {
  render({ rootStore, trayStore, ...props }) {
    return (
      <Tray
        image={Path.join(
          Constants.ROOT_PATH,
          'resources',
          'icons',
          'orbitTemplate.png',
        )}
        title={
          rootStore.screenState.isPaused
            ? 'Paused'
            : rootStore.oraState.contextMessage || 'Orbit'
        }
        {...props}
      />
    )
  }
}
