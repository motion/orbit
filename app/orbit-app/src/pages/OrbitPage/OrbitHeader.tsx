import { Absolute, FullScreen, gloss, linearGradient, Theme, useTheme } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { BorderBottom, Button, ButtonProps, Popover, Row, SegmentedRow, View } from '@mcro/ui'
import React, { memo } from 'react'
import { DateRangePicker } from 'react-date-range'
import { useActions } from '../../actions/Actions'
import { AppType } from '../../apps/AppTypes'
import OrbitFilterIntegrationButton from '../../components/OrbitFilterIntegrationButton'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useStores } from '../../hooks/useStores'
import { HorizontalSpace } from '../../views'
import { FloatingBarButton } from '../../views/FloatingBar/FloatingBarButton'
import { Icon } from '../../views/Icon'
import { WindowControls } from '../../views/WindowControls'
import OrbitHeaderInput from './OrbitHeaderInput'
import OrbitNav from './OrbitNav'

export default memo(function OrbitHeader() {
  const { orbitStore, headerStore, queryStore, newAppStore, paneManagerStore } = useStores()
  const activePaneType = paneManagerStore.activePane.type
  const { isTorn } = orbitStore
  const { isEditing } = orbitStore
  const icon = activePaneType === 'createApp' ? newAppStore.app.type : activePaneType
  const { queryFilters } = queryStore
  const theme = useTheme()

  return (
    <OrbitHeaderContainer
      isTorn={isTorn}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
    >
      <OrbitHeaderEditingBg isActive={isEditing} />
      <HeaderTop padding={isTorn ? [3, 10] : [7, 10]}>
        <OrbitClose dontDim={isTorn}>
          <WindowControls
            itemProps={{ size: 10 }}
            onClose={() => {
              if (isTorn) {
                console.log('close me...app')
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

          <HeaderContain>
            <View width={20} alignItems="center" justifyContent="center">
              <Icon
                color={theme.color}
                name={`orbit-${icon}`}
                size={18}
                opacity={theme.color.isDark() ? 0.4 : 0.2}
              />
            </View>

            <OrbitHeaderInput />

            <SegmentedRow width={80} justifyContent="center">
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
          </HeaderContain>

          <View flex={1} />
        </Row>

        <OrbitEditAppButton />

        {isEditing && (
          <Absolute top={0} right={32} bottom={0} alignItems="center" justifyContent="center">
            <Row>
              <HeaderButton icon="edit" tooltip="Open in VSCode" />
              <HorizontalSpace small />
              <Theme name="selected">
                <HeaderButton tooltip="Deploy to space">Publish</HeaderButton>
              </Theme>
            </Row>
          </Absolute>
        )}

        <Absolute
          top={0}
          right={isTorn ? 3 : 6}
          bottom={0}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            chromeless
            opacity={0.3}
            hoverStyle={{
              opacity: 8,
            }}
            icon="gear"
            iconSize={isTorn ? 10 : 12}
            onClick={() => {
              newAppStore.setShowCreateNew(false)
              if (paneManagerStore.activePane.type === 'settings') {
                paneManagerStore.back()
              } else {
                paneManagerStore.setActivePaneByType('settings')
              }
            }}
          />
        </Absolute>
      </HeaderTop>
      {!isTorn && <HeaderFade />}
      {/* this stays slightly below the active tab and looks nice */}
      <BorderBottom zIndex={0} />
      <OrbitNav />
    </OrbitHeaderContainer>
  )
})

function HeaderButton(props: ButtonProps) {
  return <Button size={0.9} sizeHeight={0.9} {...props} />
}

function OrbitEditAppButton() {
  const { orbitStore, paneManagerStore } = useStores()
  const activePaneId = paneManagerStore.activePane.id
  const activeApps = useActiveApps()
  const activeApp = activeApps.find(app => activePaneId === `${app.id}`)
  const show = activeApp && activeApp.type === AppType.custom && !orbitStore.isEditing
  const Actions = useActions()

  if (!show) {
    return null
  }

  return (
    <Absolute top={0} right={42} bottom={0} alignItems="center" justifyContent="center">
      <HeaderButton
        icon="tool"
        tooltip="Edit app"
        onClick={async () => {
          Actions.tearApp()
          orbitStore.setEditing()
        }}
      >
        Edit
      </HeaderButton>
    </Absolute>
  )
}

const OrbitHeaderEditingBg = gloss<{ isActive?: boolean }>(FullScreen, {
  zIndex: -1,
  transition: 'all ease-in 500ms',
}).theme(({ isActive }, theme) => ({
  background: isActive
    ? linearGradient(theme.selected.background, theme.selected.background.darken(0.1))
    : 'transparent',
}))

const OrbitHeaderContainer = gloss(View, {
  position: 'relative',
  overflow: 'hidden',
  zIndex: 400,
}).theme(({ isTorn }, theme) => ({
  // borderBottom: [1, theme.borderColor],
  background:
    (isTorn && theme.headerBackgroundOpaque) ||
    theme.headerBackground ||
    theme.background.alpha(a => a * 0.65),
}))

const HeaderContain = gloss({
  margin: 'auto',
  alignItems: 'center',
  flex: 10,
  flexFlow: 'row',
  maxWidth: '70%',
  minWidth: 400,
})

const HeaderFade = gloss(FullScreen, {
  zIndex: -1,
}).theme((_, theme) => {
  if (theme.headerFadeBackground) {
    return {
      background: theme.headerFadeBackground,
    }
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
