import * as React from 'react'
import { useContext } from 'react'
import { StoreContext } from '../../../contexts'
import { AppPanes } from '../../../stores/SpaceStore'
import { view } from '@mcro/black'
import { Text, Surface, Row } from '@mcro/ui'
import { SubTitle } from '../../../views/SubTitle'
import { Desktop } from '@mcro/stores'
import { useStore } from '@mcro/use-store'

const TRAY_VERT_PAD = 12
const TRAY_HEIGHT = 60
const CARD_WIDTH = 120
const CARD_SPACE = 6

export class AppTrayStore {
  get trayBounds() {
    return Desktop.state.operatingSystem.trayBounds
  }

  get trayCenter() {
    return (this.trayBounds[0] + this.trayBounds[1]) / 2
  }

  get appsWidth() {
    return AppPanes.length * CARD_WIDTH
  }

  get open() {
    return true
  }
}

const TrayCard = view({
  padding: 6,
  borderRadius: 8,
  background: [100, 100, 100],
  marginRight: CARD_SPACE,
  width: CARD_WIDTH - CARD_SPACE,
  height: TRAY_HEIGHT - TRAY_VERT_PAD,
})

export function AppTray() {
  return null
  const stores = useContext(StoreContext)
  const store = useStore(AppTrayStore, stores)
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
        {AppPanes.map(pane => {
          return (
            <TrayCard key={pane.id}>
              <Text size={1.1} fontWeight={600} sizeLineHeight={0.5} margin={0} padding={[2, 0]}>
                {pane.title}
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
