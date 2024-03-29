import { AppIcon, useModels, useStore } from '@o/kit'
import { BuildStatusModel } from '@o/models'
import { App } from '@o/stores'
import { BorderBottom, Button, Popover, PopoverProps, Stack, StackProps, SurfacePassProps, View } from '@o/ui'
import { useReaction } from '@o/use-store'
import { FullScreen, gloss, useTheme } from 'gloss'
import React, { forwardRef, memo, useEffect, useMemo, useState } from 'react'
import { useRef } from 'react'

import { mediaQueries } from '../../constants'
import { useIsOnStaticApp } from '../../hooks/seIsOnStaticApp'
import { useOm } from '../../om/om'
import { appsDrawerStore, useOrbitStore } from '../../om/stores'
import { dockWidth } from './dockWidth'
import { headerButtonProps } from './headerButtonProps'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarouselStore'
import { orbitDockStore } from './OrbitDockStore'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitHeaderOpenAppMenu } from './OrbitHeaderOpenAppMenu'
import { headerStore, useHeaderStore } from './OrbitHeaderStore'
import { OrbitNav } from './OrbitNav'

const HeaderButtonPassProps = (props: any) => {
  return <SurfacePassProps {...headerButtonProps} {...props} />
}

export const OrbitHeader = memo(() => {
  const om = useOm()
  const containerRef = useRef()
  const { focusedApp, zoomedIn } = headerStore.useStore().paneState
  const orbitStore = useOrbitStore()
  const isOnTearablePane = !useIsOnStaticApp()
  const appRole = useReaction(() => App.appRole)

  // TODO this model isn't database backed so no optimistic updating,
  // perhaps we can have a generic react hook/pattern here to handle the optimistic updates
  const [buildStatus] = useModels(BuildStatusModel)
  const [isDeveloping, setIsDeveloping] = useState(false)
  const identifier = focusedApp ? focusedApp.identifier! : ''
  const serverIsDeveloping = buildStatus.some(
    s => s.identifier === identifier && s.mode === 'development',
  )
  useEffect(() => {
    setIsDeveloping(serverIsDeveloping)
  }, [serverIsDeveloping])

  const isTorn = appRole === 'torn'
  const slim = isTorn

  const homeButtonElement = useMemo(
    () =>
      appRole === 'main' ? (
        <View width={20} margin={[0, 6]} alignItems="center" justifyContent="center">
          <OrbitNavPopover target={<HomeButton id="home-button" />}>
            <OrbitNav />
          </OrbitNavPopover>
        </View>
      ) : (
        <HomeButton id="home-button" />
      ),
    [appRole],
  )

  const height = slim ? 40 : 50

  return (
    <OrbitHeaderContainer
      nodeRef={containerRef}
      isDeveloping={isDeveloping}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
      contain="strict"
      height={height}
    >
      <OrbitHeaderEditingBg isActive={isDeveloping} />
      <HeaderTop>
        <HeaderButtonPassProps>
          <HeaderSide space="sm" slim={slim}>
            <BackButton isTorn={isTorn} />
            {homeButtonElement}
          </HeaderSide>
        </HeaderButtonPassProps>
        <HeaderContain
          direction="horizontal"
          space
          spaceAround
          isActive={false}
          isDeveloping={isDeveloping}
        >
          <OrbitHeaderInput fontSize={slim ? 15 : 20} />

          <Stack direction="horizontal" space transition="all ease 300ms">
            <SurfacePassProps sizeRadius={1.5} sizeHeight={0.9} sizeIcon={1.1} sizePadding={1.2}>
              {orbitStore.activeActions}
            </SurfacePassProps>

            <Stack
              direction="horizontal"
              space
              alignItems="center"
              {...(!isOnTearablePane && zoomedIn && { pointerEvents: 'none', opacity: 0.3 })}
            >
              {/* <a
                href="#"
                className="undraggable"
                onDragStart={e => {
                  e.preventDefault()
                  electronRequire('electron').ipcRenderer.send('ondragstart', '{ "test": "hi" }')
                }}
              >
                ok ok ok
              </a> */}

              {!isTorn && (
                <Button
                  circular
                  tooltip="Add app to workspace"
                  tooltipProps={{
                    distance: 16,
                  }}
                  coat="flat"
                  icon="plus"
                  size="sm"
                  sizeIcon={1.6}
                  glint={false}
                  glintBottom={false}
                  opacity={0.75}
                  hoverStyle={{
                    opacity: 1,
                  }}
                  onClick={om.actions.router.toggleSetupAppPage}
                />
              )}
              <OrbitHeaderOpenAppMenu
                isDeveloping={isDeveloping}
                setIsDeveloping={setIsDeveloping}
              />
            </Stack>
          </Stack>
        </HeaderContain>
        <HeaderSide space="sm" justifyContent="flex-end" slim={slim}>
          <View flex={1} />
          <OrbitDockOpenButton />
        </HeaderSide>
      </HeaderTop>
      {/* this stays slightly below the active tab and looks nice */}
      <BorderBottom
        borderColor={theme => theme.headerBorderBottom || theme.borderColor}
        zIndex={0}
        opacity={0.5}
      />
    </OrbitHeaderContainer>
  )
})

const OrbitDockOpenButton = memo(() => {
  const orbitDock = orbitDockStore.useStore()
  return (
    <View position="relative" width={dockWidth} alignItems="center">
      <HeaderButtonPassProps>
        <Button
          color={theme => (theme.background.isDark() ? '#fff' : '#000')}
          width={30}
          height={30}
          icon="selection"
          iconSize={18}
          transition="none"
          iconProps={{
            transform: {
              rotate: '90deg',
            },
          }}
          circular
          onMouseEnter={orbitDock.hoverEnter}
          onMouseLeave={orbitDock.hoverLeave}
          onClick={orbitDock.onClickDockOpen}
          {...(orbitDock.state === 'pinned' && {
            background: [0, 0, 0, 0.3],
          })}
          zIndex={2}
        />
      </HeaderButtonPassProps>
      <OpenButtonExtraArea
        isOpen={orbitDock.isOpen}
        onMouseEnter={orbitDock.hoverEnter}
        onMouseLeave={orbitDock.hoverLeave}
      />
    </View>
  )
})

const OpenButtonExtraArea = gloss<{ isOpen: boolean }>({
  position: 'absolute',
  left: 0,
  right: -100,
  top: 0,
  bottom: 0,
  zIndex: 0,
}).theme(({ isOpen }) => {
  if (isOpen) {
    return {
      height: 200,
    }
  }
})

const OrbitNavPopover = ({ children, target, ...rest }: PopoverProps) => {
  const { state, actions } = useOm()
  return (
    <Popover
      group="orbit-nav"
      target={target}
      openOnClick
      openOnHover
      delay={500}
      onHover={actions.setNavVisible}
      onChangeVisibility={actions.setNavVisible}
      open={state.navVisible}
      maxWidth="80vw"
      padding={0}
      elevation={5}
      arrowSize={10}
      distance={8}
      sizeRadius
      background={(theme => theme.backgroundStrongest) as any}
      adjust={[10, 0]}
      {...rest}
    >
      {children}
    </Popover>
  )
}

const HomeButton = memo(
  forwardRef(function HomeButton(props: any, ref) {
    const { actions } = useOm()
    const theme = useTheme()
    const { paneState } = useHeaderStore()
    return (
      <View nodeRef={ref} WebkitAppRegion="no-drag" {...props}>
        <AppIcon
          cutout
          colors={[theme.color, theme.color] as any}
          onMouseEnter={() => actions.setNavHovered(true)}
          onMouseLeave={() => actions.setNavHovered(false)}
          opacity={0.5}
          hoverStyle={{
            opacity: 1,
          }}
          identifier={paneState.focusedApp.icon}
          size={28}
          onMouseUp={e => {
            e.stopPropagation()
            if (appsDrawerStore.isOpen) {
              actions.router.closeDrawer()
              return
            }
            if (appsCarouselStore.zoomedIn) {
              appsCarouselStore.setZoomedOut()
              return
            }
            actions.router.showHomePage({ avoidZoom: true })
          }}
        />
      </View>
    )
  }),
)

// @ts-ignore
HomeButton.acceptsProps = {
  icon: true,
  hover: true,
}

const OrbitHeaderContainer = gloss<any>(View, {
  position: 'relative',
  overflow: 'hidden',
  transition: 'all ease 300ms',
  // above OrbitPageInnerChrome/DockBackground
  zIndex: 5,
}).theme(props => ({
  background: props.headerBackground,
}))

const HeaderSide = gloss<StackProps & { slim?: boolean }>(Stack, {
  flexDirection: 'row',
  flex: 1,
  width: '10%',
  minWidth: 110,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'flex-end',

  [mediaQueries.small]: {
    width: 'auto',
    minWidth: 'auto',
  },
})

const getMedia = q => window.matchMedia(q.slice(q.indexOf('(') - 1))

getMedia(mediaQueries.small).addListener(({ matches }) => {
  electronRequire('electron')
    .remote.getCurrentWindow()
    .setWindowButtonVisibility(!matches)
})

const OrbitHeaderEditingBg = gloss<{ isActive?: boolean }>(FullScreen, {
  zIndex: -1,
  transition: 'all ease-in 300ms',
})
// .theme(({ isActive }) => ({
//   // background: (isActive && theme.orbitHeaderBackgroundEditing) || 'transparent',
// }))

const HeaderContain = gloss<StackProps & { isActive?: boolean; isDeveloping: boolean }>(Stack, {
  flexDirection: 'row',
  margin: 'auto',
  alignItems: 'center',
  width: '67%',
  minWidth: 650,
  maxWidth: 950,
  borderRadius: 100,

  [mediaQueries.small]: {
    flex: 50,
    minWidth: 'auto',
    margin: 'auto',
  },
}).theme(theme => ({
  background: theme.isActive ? [0, 0, 0, theme.background.isDark() ? 0.1 : 0.075] : 'none',
}))

const HeaderTop = gloss(View, {
  height: '100%',
  flexDirection: 'row',
  position: 'relative',
})

const BackButton = memo(({ isTorn }: { isTorn: boolean }) => {
  const { state, actions } = useOm()
  const appsCarousel = useAppsCarousel()
  const appsDrawer = useStore(appsDrawerStore)
  if (isTorn && !appsDrawer.isOpen) {
    return null
  }
  return (
    <Button
      icon={appsDrawer.isOpen ? 'cross' : 'chevron-left'}
      tooltip={appsDrawer.isOpen ? 'Close drawer' : 'Back'}
      tooltipProps={{
        delay: 800,
      }}
      disabled={!appsDrawerStore.isOpen && !appsCarousel.zoomedIn && state.router.historyIndex <= 0}
      iconSize={18}
      onClick={() => {
        if (appsDrawerStore.isOpen) {
          actions.router.closeDrawer()
          return
        }
        if (appsCarousel.zoomedIn) {
          appsCarousel.setZoomedOut()
          return
        }
        actions.router.back()
      }}
    />
  )
})
