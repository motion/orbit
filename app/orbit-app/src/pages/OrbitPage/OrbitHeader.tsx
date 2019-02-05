import { Absolute, gloss, useTheme } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Button, Popover, Row, SegmentedRow, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import { AppActions } from '../../actions/AppActions'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { useOrbitToolbars } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { FloatingBarButton } from '../../views/FloatingBar/FloatingBarButton'
import { Icon } from '../../views/Icon'
import { WindowControls } from '../../views/WindowControls'
import OrbitHeaderInput from './OrbitHeaderInput'

export default observer(function OrbitHeader() {
  const { queryStore, newAppStore, orbitStore, paneManagerStore } = useStoresSafe()
  const activePaneType = paneManagerStore.activePane.type
  const isOnSettings = activePaneType === 'settings'
  const settingsIconActiveOpacityInc = isOnSettings ? 0.4 : 0
  const { isTorn } = orbitStore
  const toolbars = useOrbitToolbars()
  const icon = activePaneType === 'createApp' ? newAppStore.app.type : activePaneType
  const { queryFilters } = queryStore
  const theme = useTheme()

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

        {/* header input area */}
        <Row flex={1} alignItems="center">
          <View flex={1} />

          {isTorn && toolbars && (
            <>
              {toolbars.before}
              <View flex={1} />
            </>
          )}
          <HeaderContain>
            <View width={18} alignItems="center" justifyContent="center">
              <Icon color={theme.color} name={`orbit-${icon}`} size={18} opacity={0.15} />
            </View>

            <OrbitHeaderInput />

            {isTorn && toolbars && (
              <>
                <View flex={1} />
                {toolbars.after}
              </>
            )}

            <SegmentedRow>
              <FloatingBarButton
                onClick={queryFilters.toggleSortBy}
                tooltip={`Sort by: ${queryFilters.sortBy}`}
                icon={queryFilters.sortBy === 'Relevant' ? 'arrowup' : 'arrowdown'}
              />

              <Popover
                delay={250}
                openOnClick
                openOnHover
                closeOnClickAway
                group="filters"
                target={<FloatingBarButton icon="ui-1_calendar-57" />}
                background
                borderRadius={10}
                elevation={4}
                theme="light"
                width={420}
                height={310}
              >
                <View flex={1} className="calendar-dom theme-light" padding={10}>
                  <DateRangePicker
                    onChange={queryFilters.onChangeDate}
                    ranges={[queryFilters.dateState]}
                  />
                </View>
              </Popover>

              <OrbitFilterIntegrationButton />
            </SegmentedRow>

            {/* {!isTorn && <OrbitSpaceSwitch />} */}

            {!isTorn && (
              <Absolute top={1} right={0}>
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
                    size={13}
                    opacity={0.2 + settingsIconActiveOpacityInc}
                    hoverStyle={{
                      opacity: 0.5 + settingsIconActiveOpacityInc,
                    }}
                  />
                </Button>
              </Absolute>
            )}
          </HeaderContain>

          <View flex={1} />
        </Row>

        {/* <OrbitAutoComplete /> */}
      </HeaderTop>

      {isTorn && <OrbitHeaderDivider />}
    </>
  )
})

const HeaderContain = gloss({
  margin: 'auto',
  alignItems: 'center',
  flex: 10,
  flexFlow: 'row',
  width: '75%',
  minWidth: 400,
  maxWidth: 650,
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
