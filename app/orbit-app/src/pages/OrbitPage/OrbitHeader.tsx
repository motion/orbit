import { invertLightness } from '@o/color'
import { AppIcon, useActiveAppsSorted, useLocationLink, useStore } from '@o/kit'
import { App } from '@o/stores'
import { BorderBottom, Button, ButtonProps, Popover, PopoverProps, Row, RowProps, SizedSurfaceProps, Space, SurfacePassProps, View } from '@o/ui'
import { Box, FullScreen, gloss, useTheme } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useStores } from '../../hooks/useStores'
import { useOm } from '../../om/om'
import { OrbitSpaceSwitch } from '../../views/OrbitSpaceSwitch'
import { useIsOnStaticApp } from './OrbitDockShare'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitHeaderMenu } from './OrbitHeaderMenu'
import { OrbitNav } from './OrbitNav'

// import { clipboard } from 'electron'
export const headerButtonProps: SizedSurfaceProps = {
  circular: true,
  background: 'transparent',
  glint: false,
  glintBottom: false,
  borderWidth: 0,
  margin: [-1, 2],
  opacity: 0.75,
  hoverStyle: { opacity: 1, background: theme => theme.backgroundStronger },
  tooltipProps: {
    distance: 18,
  },
  iconSize: 14,
  activeStyle: false,
}

const HeaderButtonPassProps = (props: any) => <SurfacePassProps {...headerButtonProps} {...props} />

const activeStyle = {
  opacity: 1,
}

export const OrbitHeader = memo(() => {
  const om = useOm()
  const { orbitStore, headerStore } = useStores()
  const theme = useTheme()
  const isOnTearablePane = !useIsOnStaticApp()
  const { isEditing } = useStore(App)

  return (
    <>
      <OrbitHeaderContainer
        isEditing={isEditing}
        className="draggable"
        onMouseUp={headerStore.handleMouseUp}
      >
        <OrbitHeaderEditingBg isActive={isEditing} />

        <HeaderTop height={isEditing ? 46 : 56}>
          <HeaderButtonPassProps>
            <HeaderSide space="sm" spaceAround>
              <BackButton />
              <OrbitHeaderMenu />
            </HeaderSide>
          </HeaderButtonPassProps>

          <HeaderContain space spaceAround isActive={false} isEditing={isEditing}>
            {!isEditing && (
              <View width={20} margin={[0, 6]} alignItems="center" justifyContent="center">
                <OrbitNavPopover target={<HomeButton id="home-button" />}>
                  <OrbitNav />
                </OrbitNavPopover>
              </View>
            )}

            <OrbitHeaderInput />

            {isOnTearablePane && (
              <>
                {!!orbitStore.activeActions && (
                  <ExtraButtonsChrome>
                    <HeaderButtonPassProps iconSize={16}>
                      {orbitStore.activeActions || null}
                    </HeaderButtonPassProps>
                  </ExtraButtonsChrome>
                )}
                {!isEditing && <OpenButton />}
              </>
            )}
          </HeaderContain>

          <HeaderButtonPassProps>
            <HeaderSide space="sm" spaceAround justifyContent="flex-start" debug>
              {isEditing && (
                <SurfacePassProps size={0.9} alt="flat" iconSize={14}>
                  <>
                    <Button circular icon="edit" tooltip="Open in VSCode" />
                    <Space size="sm" />
                    <Button tooltip="Deploy to space">Publish</Button>
                    <Space size="sm" />
                  </>
                </SurfacePassProps>
              )}

              {!isEditing && (
                <>
                  <Button
                    {...om.state.router.appId === 'query-builder' && activeStyle}
                    onClick={useLocationLink('/app/query-builder')}
                    icon="layers"
                    tooltip="Query Builder"
                  />
                  <Button
                    {...om.state.router.appId === 'apps' && activeStyle}
                    onClick={useLocationLink('/app/apps')}
                    icon="layout-grid"
                    tooltip="Manage apps"
                  />
                  <OrbitSpaceSwitch />
                </>
              )}

              {isEditing && (
                <Button
                  icon="cog"
                  onClick={() => {
                    console.log('got to app specific settings')
                  }}
                />
              )}
            </HeaderSide>
          </HeaderButtonPassProps>
        </HeaderTop>

        {/* this stays slightly below the active tab and looks nice */}
        <BorderBottom
          borderColor={(isEditing && theme.headerBorderBottom) || theme.borderColor}
          zIndex={0}
        />
      </OrbitHeaderContainer>
    </>
  )
})

const OrbitNavPopover = ({ children, target, ...rest }: PopoverProps) => {
  const { state, actions } = useOm()
  const appStore = useStore(App)

  if (appStore.isEditing) {
    return null
  }

  return (
    <>
      <OrbitNavHiddenBar
        isVisible={state.navVisible}
        onClick={() => actions.setNavVisible(!state.navVisible)}
      />
      <Popover
        openKey="orbit-nav"
        target={target}
        openOnClick
        openOnHover
        onHover={actions.setNavVisible}
        onChangeVisibility={actions.setNavVisible}
        open={state.navVisible}
        maxWidth="80vw"
        padding={4}
        elevation={10}
        arrowSize={10}
        distance={8}
        sizeRadius
        background={(theme => theme.backgroundStrongest) as any}
        adjust={[10, 0]}
        {...rest}
      >
        {children}
      </Popover>
    </>
  )
}

const HomeButton = memo(
  forwardRef((props: any, ref) => {
    const { state, actions } = useOm()
    const theme = useTheme()
    const { newAppStore, paneManagerStore } = useStores()
    const { activePane } = paneManagerStore
    const activePaneType = activePane.type
    const icon = activePaneType === 'setupApp' ? newAppStore.app.identifier : activePaneType
    return (
      <View ref={ref} {...props}>
        <AppIcon
          cutout
          background={invertLightness(theme.color, 0.5)}
          onMouseEnter={() => actions.setNavHovered(true)}
          onMouseLeave={() => actions.setNavHovered(false)}
          opacity={0.65}
          hoverStyle={{
            opacity: 1,
          }}
          identifier={state.navHovered || state.navVisible ? 'home' : icon}
          size={28}
          onMouseUp={e => {
            e.stopPropagation()
            actions.router.showHomePage()
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

const OrbitNavHiddenBar = props => {
  const apps = useActiveAppsSorted().slice(0, 20)
  const { paneManagerStore } = useStores()
  // const { paneId } = paneManagerStore

  if (!apps.length) {
    return null
  }
  return (
    <OrbitNavHiddenBarChrome {...props}>
      <OrbitNavHiddenBarInner>
        {/* {apps.map(app => {
          const isActive = paneId === `${app.id}`
          return (
            <Block
              key={app.id}
              style={{
                background: app.colors ? app.colors[0] : 'black',
                width: `${100 / apps.length}%`,
                height: '100%',
                // opacity: isActive ? 1 : 0.2,
                transform: `translateY(${isActive ? 0 : 2}px)`,
                transition: 'all ease 400ms',
              }}
            />
          )
        })} */}
      </OrbitNavHiddenBarInner>
    </OrbitNavHiddenBarChrome>
  )
}

const OrbitHeaderContainer = gloss<any>(View, {
  position: 'relative',
  overflow: 'hidden',
  zIndex: 0,
}).theme((props, theme) => ({
  background:
    (props.isEditing && theme.headerBackgroundOpaque) ||
    theme.headerBackground ||
    theme.background.alpha(a => a * 0.65),
}))

const OrbitNavHiddenBarChrome = gloss(Box, {
  position: 'absolute',
  bottom: -6,
  left: 0,
  right: 0,
  padding: 6,
}).theme(() => ({
  '&:hover': {
    background: [255, 255, 255, 0.05],
  },
}))

const OrbitNavHiddenBarInner = gloss(Box, {
  flexFlow: 'row',
  height: 3,
  borderRadius: 3,
  padding: [0, '20%'],
  width: '100%',
}).theme((_, theme) => ({
  background: theme.backgroundStrongest.alpha(0.5),
}))

const HeaderSide = gloss(Row, {
  flexFlow: 'row',
  flex: 1,
  width: '18%',
  minWidth: 180,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const OrbitHeaderEditingBg = gloss<{ isActive?: boolean }>(FullScreen, {
  zIndex: -1,
  transition: 'all ease-in 500ms',
}).theme(({ isActive }, theme) => ({
  background: (isActive && theme.orbitHeaderBackgroundEditing) || 'transparent',
}))

const HeaderContain = gloss<RowProps & { isActive?: boolean; isEditing: boolean }>(Row, {
  margin: ['auto', 0],
  alignItems: 'center',
  flex: 20,
  maxWidth: 980,
  borderRadius: 100,
}).theme(({ isActive, isEditing }, theme) => ({
  background: isEditing
    ? theme.orbitInputBackgroundEditing
    : isActive
    ? [0, 0, 0, theme.background.isDark() ? 0.1 : 0.075]
    : 'none',
}))

const HeaderTop = gloss(View, {
  flexFlow: 'row',
  position: 'relative',
})

const ExtraButtonsChrome = gloss(Box, {
  flexFlow: 'row',
  paddingRight: 22,
  paddingLeft: 12,
  marginRight: -10,
  borderLeftRadius: 12,
})

const OpenButton = memo((props: ButtonProps) => {
  const { effects } = useOm()

  if (App.isEditing) {
    return null
  }

  return (
    <Button
      alt="action"
      iconSize={18}
      sizeRadius={1.6}
      borderWidth={0}
      glint={false}
      iconAfter
      tooltip="Open to desktop (⌘ + ⏎)"
      onClick={effects.openCurrentApp}
      {...props}
    >
      Open
    </Button>
  )
})

const BackButton = memo(() => {
  const { state, actions } = useOm()
  return (
    <Button
      icon="chevron-left"
      opacity={state.router.history.length ? 0.5 : 0.4}
      iconSize={18}
      onClick={actions.router.back}
    />
  )
})
