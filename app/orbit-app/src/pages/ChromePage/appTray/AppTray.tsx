import * as React from 'react'
import { Text, Surface, Row } from '@mcro/ui'
import { SubTitle } from '../../../views/SubTitle'
import { Desktop } from '@mcro/stores'
import { useStore } from '@mcro/use-store'
import { gloss } from '@mcro/gloss'
import { IS_ELECTRON } from '../../../constants'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { useObserveActiveApps } from '../../../hooks/useObserveActiveApps'

const TRAY_VERT_PAD = 12
const TRAY_HEIGHT = 60
const CARD_WIDTH = 120
const CARD_SPACE = 6

export class AppTrayStore {
  get trayPosition() {
    return Desktop.state.operatingSystem.trayBounds.position
  }

  get trayCenter() {
    return (this.trayPosition[0] + this.trayPosition[1]) / 2
  }

  get appsWidth() {
    return 3 * CARD_WIDTH
  }

  get open() {
    return true
  }
}

const TrayCard = gloss({
  padding: 6,
  borderRadius: 8,
  background: [100, 100, 100],
  marginRight: CARD_SPACE,
  width: CARD_WIDTH - CARD_SPACE,
  height: TRAY_HEIGHT - TRAY_VERT_PAD,
})

export function AppTray() {
  if (IS_ELECTRON) {
    return null
  }
  const stores = useStoresSafe()
  const store = useStore(AppTrayStore, stores)
  const activeApps = useObserveActiveApps()
  console.log('------render --- Apptray', stores)
  return (
    <Surface
      hover={false}
      select={false}
      active={false}
      padding={[TRAY_VERT_PAD / 2, 10]}
      height={TRAY_HEIGHT}
      transition="transform 200ms ease"
      transform={{
        y: store.open ? 0 : -TRAY_HEIGHT,
      }}
    >
      <Row width={store.appsWidth} transform={{ x: store.trayCenter - store.appsWidth / 2 }}>
        {activeApps.map(app => {
          return (
            <TrayCard key={app.id}>
              <Text size={1.1} fontWeight={600} sizeLineHeight={0.5} margin={0} padding={[2, 0]}>
                {app.name}
              </Text>
              <SubTitle margin={0} padding={0}>
                Some subtitle
              </SubTitle>
            </TrayCard>
          )
        })}
      </Row>
    </Surface>
  )
}
