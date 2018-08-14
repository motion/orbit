import * as React from 'react'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { App } from '@mcro/stores'

@view.electron
export class VibrantWindow extends React.Component {
  render() {
    return (
      <Window
        show={App.orbitState.docked}
        vibrancy="light"
        transparent
        titleBarStyle="customButtonsOnHover"
        backgroundColor="#ffffff55"
        position={[
          App.orbitState.position[0] - 10,
          App.orbitState.position[1] + 10,
        ]}
        size={App.orbitState.size}
        webPreferences={{
          nativeWindowOpen: true,
          experimentalFeatures: true,
          transparentVisuals: true,
        }}
      />
    )
  }
}
