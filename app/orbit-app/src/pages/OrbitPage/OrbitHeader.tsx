import { Absolute, FullScreen, gloss } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Button, Row, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { useOrbitToolbars } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Icon } from '../../views/Icon'
import { WindowControls } from '../../views/WindowControls'
import OrbitHeaderInput from './OrbitHeaderInput'
import OrbitSpaceSwitch from './OrbitSpaceSwitch'

export default observer(function OrbitHeader() {
  const { orbitStore, paneManagerStore } = useStoresSafe()
  const isOnSettings = paneManagerStore.activePane.type === 'settings'
  const settingsIconActiveOpacityInc = isOnSettings ? 0.4 : 0
  const { isTorn } = orbitStore
  const toolbars = useOrbitToolbars()

  return (
    <>
      <HeaderTop padding={isTorn ? [2, 10] : [7, 10]}>
        <OrbitClose dontDim={isTorn} onClick={AppActions.closeOrbit}>
          <WindowControls
            itemProps={{ size: 10 }}
            onClose={() => {
              if (isTorn) {
                console.log('close me')
              } else {
                App.setOrbitState({ docked: !App.orbitState.docked })
              }
            }}
            onMin={isTorn ? () => console.log('min') : null}
            onMax={isTorn ? () => console.log('min') : null}
          />
        </OrbitClose>
        <Row flex={1} alignItems="center">
          <Row flex={1} />
          {isTorn && toolbars && (
            <>
              {toolbars.before}
              <View flex={1} />
            </>
          )}

          <Icon name={`orbit-${paneManagerStore.activePane.type}`} size={18} opacity={0.18} />
          <OrbitHeaderInput />

          {isTorn && toolbars && (
            <>
              <View flex={1} />
              {toolbars.after}
            </>
          )}
          {!isTorn && <OrbitSpaceSwitch />}
          {!isTorn && (
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

        {/* <OrbitAutoComplete /> */}
      </HeaderTop>

      {isTorn && <OrbitHeaderDivider />}
      <OrbitHeaderBg />
    </>
  )
})

// const OrbitAutoComplete = observer(function OrbitAutoComplete() {
//   const { orbitStore } = useStoresSafe()
//   const activeAppStore = orbitStore.appStores[orbitStore.activePane.id]
//   return null
//   return (
//     <Absolute bottom={0} left={0}>
//       {activeAppStore.toolbar || null}
//     </Absolute>
//   )
// })

const OrbitHeaderDivider = gloss({
  height: 1,
}).theme((_, theme) => ({
  background: theme.borderColor.alpha(0.6),
}))

const HeaderTop = gloss(View, {
  flexFlow: 'row',
  position: 'relative',
})

const OrbitHeaderBg = gloss(FullScreen, {
  zIndex: -1,
  pointerEvents: 'none',
}).theme((_, theme) => ({
  background: theme.background.isDark()
    ? 'transparent'
    : `linear-gradient(${theme.background.alpha(0.1)},${theme.background.alpha(0)})`,
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
