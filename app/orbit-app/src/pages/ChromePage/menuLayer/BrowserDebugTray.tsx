import { Absolute, Row, View } from '@o/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { IS_ELECTRON } from '../../../constants'
import { useStores } from '../../../hooks/useStores'

export default function BrowserDebugTray({ children }: any) {
  if (IS_ELECTRON) {
    return children
  }

  const { menuStore } = useStores()

  // set open the first menu by default for dev
  React.useEffect(() => {
    menuStore
    // .setPinnedOpen(1, true)
  })

  return (
    <Absolute top={0} left={0} right={0}>
      <Row justifyContent="center" alignItems="center" width="100%" background="#eee">
        <View
          onMouseLeave={() => {
            // commented since app sends command to itself
            // App.sendMessage(App, App.messages.TRAY_EVENT, { type: 'trayHovered', value: 'Out' })
            // command(TrayEventCommand, { type: 'trayHovered', value: 'Out' })
          }}
          flexFlow="row"
          height={28}
          alignItems="center"
          pointerEvents="auto"
        >
          <Target id={3} />
          <Target id={2} />
          <Target id={1} />
          <Target id={0} />
        </View>
      </Row>
      <View position="relative" flex={1}>
        {children}
      </View>
    </Absolute>
  )
}

const Target = observer((props: { id: number }) => {
  const { menuStore } = useStores()
  return (
    <View
      onMouseEnter={() => {
        // commented since app sends command to itself
        // App.sendMessage(App, App.messages.TRAY_EVENT, { type: 'trayHovered', value: `${props.id}` })
        // command(TrayEventCommand, { type: 'trayHovered', value: `${props.id}` })
      }}
      onClick={() => {
        console.log('pin', props.id)
        menuStore.setPinnedOpen(props.id, true)
      }}
      width={16}
      height={16}
      margin={[0, 5]}
      borderRadius={100}
      background={menuStore.activeMenuIndex === props.id ? '#555' : '#000'}
    />
  )
})
