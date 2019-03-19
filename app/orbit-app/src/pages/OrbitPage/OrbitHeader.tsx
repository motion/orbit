import { FullScreen, gloss, Theme, useTheme } from '@o/gloss'
import { Icon, useActiveApps } from '@o/kit'
import { App } from '@o/stores'
import { BorderBottom, Button, ButtonProps, Row, SegmentedRow, Space, View } from '@o/ui'
import React, { memo } from 'react'
import { useActions } from '../../hooks/useActions'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { OrbitSpaceSwitch } from '../../views/OrbitSpaceSwitch'
import { WindowControls } from '../../views/WindowControls'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitNav } from './OrbitNav'

export const OrbitHeader = memo(function OrbitHeader() {
  const { orbitStore, headerStore, newAppStore, paneManagerStore, themeStore } = useStores()
  const { activePane } = paneManagerStore
  const activePaneType = activePane.type
  const { isTorn } = orbitStore
  const { isEditing } = orbitStore
  const icon = activePaneType === 'createApp' ? newAppStore.app.identifier : activePaneType
  const theme = useTheme()
  const isOnSettings = activePaneType === 'settings' || activePaneType === 'spaces'
  const isOnTearablePane = activePaneType !== activePane.id

  return (
    <OrbitHeaderContainer
      isTorn={isTorn}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
    >
      <OrbitHeaderEditingBg isActive={isEditing} />
      <HeaderTop padding={isTorn ? [3, 10] : [5, 10]}>
        <OrbitClose dontDim={isTorn}>
          <WindowControls
            itemProps={{ size: 10 }}
            spaceBetween={3}
            showOnHover={{ min: true, max: true }}
            onClose={() => {
              if (isTorn) {
                console.log('close me...app')
              } else {
                App.setOrbitState({ docked: !App.orbitState.docked })
              }
            }}
            onMin={() =>
              require('electron')
                .remote.getCurrentWindow()
                .minimize()
            }
            onMax={() =>
              require('electron')
                .remote.getCurrentWindow()
                .maximize()
            }
          />
        </OrbitClose>

        <HeaderSide>
          <HeaderButtonChromeless
            icon="sidebar"
            onClick={themeStore.setToggleShowSidebar}
            opacity={themeStore.showSidebar ? 0.6 : 0.3}
          />

          <View flex={1} />

          <BackButton />
        </HeaderSide>

        <HeaderContain isActive={false}>
          <View width={20} marginLeft={6} alignItems="center" justifyContent="center">
            <Icon
              color={theme.color}
              name={`orbit-${icon}`}
              size={18}
              opacity={theme.color.isDark() ? 0.4 : 0.2}
            />
          </View>

          <OrbitHeaderInput />

          {isOnTearablePane && (
            <SegmentedRow sizeHeight={0.9} sizeRadius={2} sizePadding={1.25}>
              <LinkButton />
              {!isTorn && <LaunchButton />}
            </SegmentedRow>
          )}
        </HeaderContain>

        <HeaderSide rightSide>
          <OrbitEditAppButton />

          {isEditing && (
            <Row>
              <HeaderButton icon="edit" tooltip="Open in VSCode" />
              <Space small />
              <Theme name="selected">
                <HeaderButton tooltip="Deploy to space">Publish</HeaderButton>
              </Theme>
            </Row>
          )}

          {!isTorn && <OrbitSpaceSwitch />}

          <Button
            chromeless
            opacity={isOnSettings ? 0.8 : 0.4}
            hoverStyle={{
              opacity: isOnSettings ? 1 : 0.6,
            }}
            icon="gear"
            iconSize={isTorn ? 10 : 12}
            onClick={() => {
              newAppStore.setShowCreateNew(false)
              if (activePaneType === 'settings') {
                paneManagerStore.back()
              } else {
                paneManagerStore.setActivePaneByType('settings')
              }
            }}
          />
        </HeaderSide>
      </HeaderTop>
      {!isTorn && <HeaderFade />}
      {/* this stays slightly below the active tab and looks nice */}
      <BorderBottom
        borderColor={(isTorn && theme.headerBorderBottom) || theme.borderColor}
        zIndex={0}
      />
      <OrbitNav />
    </OrbitHeaderContainer>
  )
})

const HeaderSide = gloss({
  flexFlow: 'row',
  flex: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: [0, 0, 0, 10],
  rightSide: {
    padding: [0, 10, 0, 0],
    justifyContent: 'flex-end',
  },
})

function HeaderButton(props: ButtonProps) {
  return <Button size={0.9} sizeHeight={0.9} {...props} />
}

function OrbitEditAppButton() {
  const { orbitStore, paneManagerStore } = useStores()
  const activePaneId = paneManagerStore.activePane.id
  const activeApps = useActiveApps()
  const activeApp = activeApps.find(app => activePaneId === `${app.id}`)
  const show = activeApp && activeApp.identifier === 'custom' && !orbitStore.isEditing
  const Actions = useActions()

  if (!show) {
    return null
  }

  return (
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
  )
}

const OrbitHeaderEditingBg = gloss<{ isActive?: boolean }>(FullScreen, {
  zIndex: -1,
  transition: 'all ease-in 500ms',
}).theme(({ isActive }, theme) => ({
  background: (isActive && theme.orbitHeaderBackgroundEditing) || 'transparent',
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

const HeaderContain = gloss<{ isActive?: boolean }>({
  margin: 'auto',
  alignItems: 'center',
  flexFlow: 'row',
  width: 'calc(100% - 300px)',
  maxWidth: 800,
  minWidth: 400,
  padding: [1, 5],
  borderRadius: 100,
}).theme(({ isActive }, theme) => ({
  background: isActive ? [0, 0, 0, theme.background.isDark() ? 0.1 : 0.075] : 'none',
}))

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
  top: 1,
  left: 2,
  padding: 4,
  opacity: 0.25,
  '&:hover': {
    opacity: 1,
  },
  dontDim: {
    opacity: 1,
  },
})

const LaunchButton = memo(() => {
  const Actions = useActions()
  const { orbitStore } = useStores()
  // const [_isHovered, setHovered] = useState(false)
  // const tm = useRef(null)

  if (orbitStore.isTorn) {
    return null
  }

  return (
    <Button
      tooltip="Open app (⌘ + ⏎)"
      width={50}
      onClick={Actions.tearApp}
      fontWeight={500}
      sizeFont={0.9}
      alpha={0.5}
      elementProps={{
        transform: { y: -0.5 },
      }}
    >
      Open
    </Button>
  )
})

function HeaderButtonChromeless(props: ButtonProps) {
  return (
    <Button
      chromeless
      opacity={0.5}
      hoverStyle={{ opacity: 0.75 }}
      sizeHeight={0.95}
      sizePadding={1.2}
      iconSize={16}
      {...props}
    />
  )
}

const LinkButton = memo(() => {
  const { locationStore } = useStores()
  return (
    <Button iconSize={9} tooltip={`Copy link (⌘ + C): ${locationStore.urlString}`} icon="link69" />
  )
})

const BackButton = memo(() => {
  const { locationStore } = useStoresSimple()
  console.log('location store is', locationStore)
  const opacity = locationStore.history.length ? 0.4 : 0.1
  return (
    <HeaderButtonChromeless
      icon="arrowminleft"
      opacity={opacity}
      iconSize={20}
      onClick={() => {
        locationStore.back()
      }}
    />
  )
})
