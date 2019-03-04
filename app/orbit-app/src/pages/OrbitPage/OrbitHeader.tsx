import { Absolute, FullScreen, gloss, Theme, useTheme } from '@mcro/gloss'
import { Icon, useActiveApps } from '@mcro/kit'
import { App } from '@mcro/stores'
import {
  BorderBottom,
  Button,
  ButtonProps,
  HorizontalSpace,
  Row,
  SegmentedRow,
  Text,
  View,
} from '@mcro/ui'
import React, { memo, useState } from 'react'
import { useActions } from '../../hooks/useActions'
import { useStores } from '../../hooks/useStores'
import { OrbitSpaceSwitch } from '../../views/OrbitSpaceSwitch'
import { WindowControls } from '../../views/WindowControls'
import OrbitHeaderInput from './OrbitHeaderInput'
import OrbitNav from './OrbitNav'

export const OrbitHeader = memo(function OrbitHeader() {
  const { orbitStore, headerStore, newAppStore, paneManagerStore } = useStores()
  const activePaneType = paneManagerStore.activePane.type
  const { isTorn } = orbitStore
  const { isEditing } = orbitStore
  const icon = activePaneType === 'createApp' ? newAppStore.app.identifier : activePaneType
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
            onMin={() => console.log('min')}
            onMax={() => console.log('min')}
          />
        </OrbitClose>

        {/* header input area */}
        <Row flex={1} alignItems="center">
          <View flex={1} />

          <BackButton />

          <HeaderContain isActive>
            <View width={20} marginLeft={6} alignItems="center" justifyContent="center">
              <Icon
                color={theme.color}
                name={`orbit-${icon}`}
                size={18}
                opacity={theme.color.isDark() ? 0.4 : 0.2}
              />
            </View>

            <OrbitHeaderInput />

            <SegmentedRow>
              <LinkButton />
              {!isTorn && <LaunchButton />}
            </SegmentedRow>
          </HeaderContain>

          <View flex={1} />
        </Row>

        <Absolute
          top={0}
          right={isTorn ? 3 : 6}
          bottom={0}
          alignItems="center"
          justifyContent="center"
          flexFlow="row"
        >
          <OrbitEditAppButton />

          {isEditing && (
            <Row>
              <HeaderButton icon="edit" tooltip="Open in VSCode" />
              <HorizontalSpace small />
              <Theme name="selected">
                <HeaderButton tooltip="Deploy to space">Publish</HeaderButton>
              </Theme>
            </Row>
          )}

          <OrbitSpaceSwitch />

          <Button
            chromeless
            opacity={paneManagerStore.activePane.type === 'settings' ? 0.8 : 0.3}
            hoverStyle={{
              opacity: paneManagerStore.activePane.type === 'settings' ? 0.8 : 0.4,
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
      <BorderBottom
        borderColor={(isTorn && theme.headerBorderBottom) || theme.borderColor}
        zIndex={0}
      />
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
  flex: 10,
  flexFlow: 'row',
  maxWidth: '70%',
  minWidth: 400,
  padding: [1, 5],
  borderRadius: 100,
}).theme(({ isActive }, theme) => ({
  background: isActive ? [0, 0, 0, theme.background.isDark() ? 0.1 : 0.075] : 'transparent',
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

const LaunchButton = memo(() => {
  const Actions = useActions()
  const { orbitStore } = useStores()
  const [isHovered, setHovered] = useState(false)

  if (orbitStore.isTorn) {
    return null
  }

  return (
    <Button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sizeHeight={0.95}
      sizeRadius={2}
      onClick={Actions.tearApp}
      width={85}
    >
      {!isHovered ? (
        <Text fontWeight={500} alpha={0.9}>
          Open
        </Text>
      ) : (
        <Text size={0.7} alpha={0.5} transform={{ y: 1 }}>
          ⌘ ⏎
        </Text>
      )}
    </Button>
  )
})

const LinkButton = memo(() => {
  return (
    <Button
      sizeHeight={0.95}
      sizePadding={1.2}
      tooltip={`Copy link: app://search/?query=something`}
      sizeRadius={2}
      icon="link"
    />
  )
})

const BackButton = memo(() => {
  return (
    <View width={40} marginLeft={-40} padding={[0, 10]}>
      <Button
        chromeless
        sizeHeight={0.95}
        sizePadding={1.2}
        sizeRadius={2}
        icon="arrowminleft"
        iconSize={22}
        opacity={0.5}
      />
    </View>
  )
})
