import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/stores'
import { Col } from '@mcro/ui'
import { ORBIT_WIDTH } from '@mcro/constants'
import { BORDER_RADIUS } from '../../../constants'
import { OrbitChrome } from './OrbitChrome'
import { OrbitPaneManager } from './OrbitPaneManager'

@view
export class OrbitLayer extends React.Component {
  render() {
    const theme = App.state.darkTheme ? 'clearDark' : 'clearLight'
    return (
      <OrbitDockedFrame className={`theme-${theme} app-parent-bounds`} visible>
        <OrbitChrome />
        <OrbitPaneManager />
      </OrbitDockedFrame>
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
