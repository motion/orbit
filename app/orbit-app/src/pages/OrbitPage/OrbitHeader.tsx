import { Absolute, FullScreen, gloss, linearGradient, useTheme } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Button, Popover, Row, SegmentedRow, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateRangePicker } from 'react-date-range'
import { AppActions } from '../../actions/AppActions'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { useOrbitToolbars } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { BorderBottom } from '../../views/Border'
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
            <View width={24} alignItems="center" justifyContent="center">
              <Icon color={theme.color} name={`orbit-${icon}`} size={20} opacity={0.12} />
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
                icon={queryFilters.sortBy === 'Relevant' ? 'shape-circle' : 'arrowup'}
              />

              <Popover
                openOnClick
                closeOnClickAway
                group="filters"
                target={<FloatingBarButton icon="ui-1_calendar-57" />}
                background
                borderRadius={10}
                elevation={4}
                themeName="light"
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

        {isTorn && <BorderBottom opacity={0.35} />}
      </HeaderTop>
      <HeaderFade />
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
  maxWidth: 680,
})

const HeaderFade = gloss(FullScreen).theme((_, theme) => {
  const lighterBg = theme.headerBackground.getColors()[0]
  lighterBg[3] = 0.15
  const background = linearGradient('to right', lighterBg, 'transparent', lighterBg)
  return {
    background,
  }
})

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
