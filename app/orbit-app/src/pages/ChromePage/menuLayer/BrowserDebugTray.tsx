import * as React from 'react'
import { Row, FullScreen, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { react } from '@mcro/black'
import { App } from '@mcro/stores'
import { IS_ELECTRON } from '../../../constants'

class DebugTrayStore {
  props: { id: number }
  target = { id: null, at: null }

  setupHover = react(
    () => this.target.id,
    current => {
      App.setState({
        trayState: {
          trayEvent: `TrayHover${current}`,
          trayHoverAt: Date.now(),
        },
      })
    },
    {
      deferFirstRun: true,
    },
  )

  targetSetter = id => () => {
    console.log('id', id)
    this.target = {
      id,
      at: Date.now(),
    }
  }

  onLeave = this.targetSetter('Out')
}

export const BrowserDebugTray = ({ children }) => {
  const store = useStore(DebugTrayStore)
  if (IS_ELECTRON) {
    return children
  }
  return (
    <FullScreen>
      <Row justifyContent="center" alignItems="center" width="100%" background="#eee">
        <View
          onMouseLeave={store.onLeave}
          flexFlow="row"
          height={28}
          alignItems="center"
          pointerEvents="auto"
        >
          <Target id={0} store={store} />
          <Target id={1} store={store} />
          <Target id={2} store={store} />
        </View>
      </Row>
      <View position="relative" flex={1}>
        {children}
      </View>
    </FullScreen>
  )
}

const Target = ({ id, store }) => {
  return (
    <View
      onMouseEnter={store.targetSetter(id)}
      width={16}
      height={16}
      margin={[0, 5]}
      borderRadius={100}
      background="#000"
    />
  )
}
