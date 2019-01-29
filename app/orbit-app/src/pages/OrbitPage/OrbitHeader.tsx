import { Absolute, FullScreen, gloss } from '@mcro/gloss'
import { Button, Icon, Row, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { OrbitToolBarRender } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { WindowControls } from '../../views/WindowControls'
import OrbitHeaderInput from './OrbitHeaderInput'
import OrbitSwitch from './OrbitSpaceSwitch'

export default observer(function OrbitHeader() {
  const { headerStore, orbitStore, paneManagerStore } = useStoresSafe()
  const isOnSettings = paneManagerStore.activePane.type === 'settings'
  const settingsIconActiveOpacityInc = isOnSettings ? 0.4 : 0
  return (
    <>
      <HeaderTop padding={orbitStore.isTorn ? [2, 10] : [6, 10]}>
        <OrbitClose dontDim={orbitStore.isTorn} onClick={AppActions.closeOrbit}>
          <WindowControls
            itemProps={{ size: 10 }}
            onClose={() => console.log('close')}
            onMin={orbitStore.isTorn ? () => console.log('min') : null}
            onMax={orbitStore.isTorn ? () => console.log('min') : null}
          />
        </OrbitClose>
        <Row flex={1} alignItems="center">
          <Row flex={1} />
          {!orbitStore.isTorn && <OrbitSwitch />}
          <OrbitToolBarRender key={`${orbitStore.isTorn}`}>
            {toolbars => (
              <>
                {orbitStore.isTorn && toolbars && toolbars.before}
                <OrbitHeaderInput headerStore={headerStore} />
                {orbitStore.isTorn && toolbars && toolbars.after}
              </>
            )}
          </OrbitToolBarRender>
          {!orbitStore.isTorn && (
            <Absolute top={0} right={0}>
              <Button
                chromeless
                isActive={isOnSettings}
                onClick={() => {
                  if (isOnSettings) {
                    paneManagerStore.back()
                  } else {
                    paneManagerStore.setActivePaneByType('settings')
                  }
                }}
                tooltip="Settings"
              >
                <Icon
                  name="gear"
                  size={12}
                  opacity={0.2 + settingsIconActiveOpacityInc}
                  hoverStyle={{
                    opacity: 0.5 + settingsIconActiveOpacityInc,
                  }}
                />
              </Button>
            </Absolute>
          )}
          <Row flex={1} />
        </Row>

        <OrbitAutoComplete />
      </HeaderTop>

      {/* <OrbitHeaderDivider torn={orbitStore.isTorn} /> */}
      <OrbitHeaderBg />
    </>
  )
})

const OrbitAutoComplete = observer(function OrbitAutoComplete() {
  const { orbitStore } = useStoresSafe()
  const activeAppStore = orbitStore.appStores[orbitStore.activePane.id]
  return null
  return (
    <Absolute bottom={0} left={0}>
      {activeAppStore.toolbar || null}
    </Absolute>
  )
})

// const OrbitHeaderDivider = gloss<{ torn?: boolean }>({
//   height: 1,
// }).theme(({ torn }, theme) => ({
//   background: torn ? theme.borderColor.alpha(0.5) : theme.tabBackground,
// }))

const HeaderTop = gloss(View, {
  flexFlow: 'row',
  position: 'relative',
})

const OrbitHeaderBg = gloss(FullScreen, {
  zIndex: -1,
  pointerEvents: 'none',
}).theme((_, theme) => ({
  background: `linear-gradient(${theme.background.alpha(0.45)},${theme.background.alpha(0)})`,
}))

const OrbitClose = gloss({
  position: 'absolute',
  top: 2,
  left: 3,
  padding: 4,
  opacity: 0.1,
  '&:hover': {
    opacity: 1,
  },
  dontDim: {
    opacity: 1,
  },
})
