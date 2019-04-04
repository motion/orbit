import { invertLightness } from '@o/color'
import { FullScreen, gloss, SimpleText, useTheme } from '@o/gloss'
import { Icon, useActiveApps } from '@o/kit'
import { isEditing } from '@o/stores'
import { BorderBottom, Button, ButtonProps, Row, Space, SurfacePassProps, View } from '@o/ui'
// import { clipboard } from 'electron'
import React, { memo } from 'react'
import { useActions } from '../../hooks/useActions'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { OrbitSpaceSwitch } from '../../views/OrbitSpaceSwitch'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitNav } from './OrbitNav'

export const OrbitHeader = memo(function OrbitHeader() {
  const { headerStore, newAppStore, paneManagerStore } = useStores()
  const { activePane } = paneManagerStore
  const activePaneType = activePane.type
  const icon = activePaneType === 'createApp' ? newAppStore.app.identifier : activePaneType
  const theme = useTheme()
  const isOnSettings = activePaneType === 'settings' || activePaneType === 'spaces'
  const isOnTearablePane = activePaneType !== activePane.id

  return (
    <OrbitHeaderContainer
      isEditing={isEditing}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
    >
      <OrbitHeaderEditingBg isActive={isEditing} />
      <HeaderTop padding={isEditing ? [3, 10] : [5, 10]}>
        <HeaderSide>
          <View flex={1} />
          {/* <HeaderButtonChromeless
            icon="sidebar"
            onClick={themeStore.setToggleShowSidebar}
            active={themeStore.showSidebar}
          /> */}

          <BackButton />
        </HeaderSide>

        <HeaderContain isActive={false}>
          <View width={20} margin={[0, 6]} alignItems="center" justifyContent="center">
            <Icon
              opacity={0.15}
              color={invertLightness(theme.color, 0.5)}
              name={`orbit-${icon}`}
              size={22}
            />
          </View>

          <OrbitHeaderInput />

          {isOnTearablePane && (
            <>
              <SurfacePassProps chromeless>
                <OrbitEditAppButton />
                <Space />
                <LinkButton />
                <Space />
                <HeaderButtonChromeless icon="gear" tooltip="App Settings" />
                <Space />
              </SurfacePassProps>
              <SurfacePassProps sizeRadius={1.2} sizePadding={1.2} fontWeight={500}>
                {!isEditing && <LaunchButton />}
              </SurfacePassProps>
            </>
          )}
        </HeaderContain>

        <HeaderSide rightSide>
          {isEditing && (
            <Row>
              <HeaderButton icon="edit" tooltip="Open in VSCode" />
              <Space small />
              <HeaderButton alt="action" tooltip="Deploy to space">
                Publish
              </HeaderButton>
            </Row>
          )}

          {!isEditing && <OrbitSpaceSwitch />}

          {isEditing && (
            <Button
              chromeless
              opacity={isOnSettings ? 0.8 : 0.4}
              hoverStyle={{
                opacity: isOnSettings ? 1 : 0.6,
              }}
              icon="gear"
              iconSize={isEditing ? 10 : 12}
              onClick={() => {
                newAppStore.setShowCreateNew(false)
                if (activePaneType === 'settings') {
                  paneManagerStore.back()
                } else {
                  paneManagerStore.setActivePaneByType('settings')
                }
              }}
            />
          )}
        </HeaderSide>
      </HeaderTop>
      {!isEditing && <HeaderFade />}
      {/* this stays slightly below the active tab and looks nice */}
      <BorderBottom
        borderColor={(isEditing && theme.headerBorderBottom) || theme.borderColor}
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
  const { paneManagerStore, orbitStore } = useStores()
  const activePaneId = paneManagerStore.activePane.id
  const activeApps = useActiveApps()
  const activeApp = activeApps.find(app => activePaneId === `${app.id}`)
  const show = activeApp && activeApp.identifier === 'custom' && !isEditing
  const Actions = useActions()

  if (!show) {
    return null
  }

  return (
    <>
      <Space />
      <HeaderButtonChromeless
        icon="tool"
        tooltip="Edit app"
        onClick={async () => {
          Actions.tearApp()
          orbitStore.setEditing()
        }}
      />
    </>
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
}).theme((props, theme) => ({
  // borderBottom: [1, theme.borderColor],
  background:
    // 'rgba(0,50, 200, 0.2)' ||
    (props.isEditing && theme.headerBackgroundOpaque) ||
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

const LaunchButton = memo(() => {
  const Actions = useActions()
  // const [_isHovered, setHovered] = useState(false)
  // const tm = useRef(null)

  if (isEditing) {
    return null
  }

  return (
    <Button tooltip="Open app onto desktop" onClick={Actions.tearApp}>
      Open{' '}
      <SimpleText alpha={0.5} transform={{ y: 1 }} marginLeft={6} size={0.7} fontWeight={200}>
        ⌘ + ⏎
      </SimpleText>
    </Button>
  )
})

function HeaderButtonChromeless(props: ButtonProps) {
  return (
    <Button
      chromeless
      marginTop={-1}
      opacity={0.5}
      hoverStyle={{ opacity: 0.75 }}
      iconSize={14}
      circular
      {...props}
    />
  )
}

const LinkButton = memo(() => {
  // const { locationStore } = useStores()
  return (
    <HeaderButtonChromeless
      tooltip={`Copy link to app`}
      icon="link69"
      onClick={() => {
        // clipboard.writeText(locationStore.urlString)
      }}
    />
  )
})

const BackButton = memo(() => {
  const { locationStore } = useStoresSimple()
  return (
    <HeaderButtonChromeless
      icon="arrowminleft"
      opacity={locationStore.history.length ? 0.5 : 0.4}
      iconSize={20}
      onClick={() => {
        locationStore.back()
      }}
    />
  )
})
