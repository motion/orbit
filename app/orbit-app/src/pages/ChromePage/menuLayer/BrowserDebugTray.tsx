import * as React from 'react'
import { Row, FullScreen, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { IS_ELECTRON } from '../../../constants'

export const BrowserDebugTray = ({ children }) => {
  if (IS_ELECTRON) {
    return children
  }
  return (
    <FullScreen>
      <Row
        pointerEvents="auto"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height={28}
        background="#eee"
      >
        <Target id={0} />
        <Target id={1} />
        <Target id={2} />
      </Row>
      <View position="relative" flex={1}>
        {children}
      </View>
    </FullScreen>
  )
}

class TargetStore {
  props: { id: number }
  target = null

  setupHover = react(
    () => this.target,
    target => {
      ensure('target', !!target)
      App.setState({
        trayState: {
          trayEvent: `TrayHover${this.props.id}`,
          trayHoverAt: Date.now(),
        },
      })
    },
    {
      deferFirstRun: true,
    },
  )
}

const Target = ({ id }) => {
  const store = useStore(TargetStore, { id })
  return (
    <View
      onMouseEnter={() => (store.target = Date.now())}
      width={16}
      height={16}
      margin={[0, 5]}
      borderRadius={100}
      background="#000"
    />
  )
}
