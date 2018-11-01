import * as React from 'react'
import { react, view, attach } from '@mcro/black'
import { App } from '@mcro/stores'
import { Col, Theme } from '@mcro/ui'
import { ORBIT_WIDTH } from '@mcro/constants'
import { BORDER_RADIUS } from '../../../constants'
import { OrbitChrome } from './OrbitChrome'
import { OrbitPaneManager } from './OrbitPaneManager'

class OrbitLayerStore {
  // when we open an app window we have to change our strategy for showing/hiding orbit
  // with only one open we just use electron show/hide entire app, so return true
  // otherwise we use in-app logic here
  shouldShowOrbitDocked = react(
    () => [App.appsState.length, App.orbitState.docked],
    ([numApps, isDocked]) => {
      if (numApps === 1) {
        return true
      } else {
        return isDocked
      }
    },
  )
}

@attach({
  store: OrbitLayerStore,
})
export class OrbitLayer extends React.Component<{ store?: OrbitLayerStore }> {
  render() {
    console.log('-------- ORBIT PAGE ------------')
    const theme = App.state.darkTheme ? 'clearDark' : 'clearLight'
    return (
      <Theme name={theme}>
        <OrbitDockedFrame
          className={`theme-${theme}`}
          visible={this.props.store.shouldShowOrbitDocked}
        >
          <OrbitChrome />
          <OrbitPaneManager />
        </OrbitDockedFrame>
      </Theme>
    )
  }
}

const OrbitDockedFrame = view(Col, {
  position: 'absolute',
  top: 10,
  right: 10,
  bottom: 10,
  width: ORBIT_WIDTH,
  borderRadius: BORDER_RADIUS + 2,
  zIndex: 2,
  flex: 1,
  pointerEvents: 'none',
  opacity: 0,
  visible: {
    pointerEvents: 'auto',
    opacity: 1,
  },
})
