import { invertLightness } from '@o/color'
import { Icon, useActiveAppsSorted, useLocationLink, useStore } from '@o/kit'
import { App } from '@o/stores'
import { BorderBottom, Button, Popover, PopoverProps, Row, RowProps, Space, SurfacePassProps, View } from '@o/ui'
import { Block, Box, FullScreen, gloss, useTheme } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useStores } from '../../hooks/useStores'
import { useOm } from '../../om/om'
import { OrbitSpaceSwitch } from '../../views/OrbitSpaceSwitch'
import { useIsOnStaticApp } from './OrbitDockShare'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitHeaderMenu } from './OrbitHeaderMenu'
import { OrbitNav } from './OrbitNav'

// import { clipboard } from 'electron'
export const headerButtonProps = {
  circular: true,
  background: 'transparent',
  glint: false,
  glintBottom: false,
  borderWidth: 0,
  margin: [-1, 2],
  opacity: 0.75,
  hoverStyle: { opacity: 1, background: theme => theme.backgroundStronger },
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
          <HeaderSide spaceAround>
            <HeaderButtonPassProps>
              <BackButton />
              <OrbitHeaderMenu />
            </HeaderButtonPassProps>
          </HeaderSide>

          <HeaderContain isActive={false} isEditing={isEditing}>
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
                <SurfacePassProps sizeRadius={1.2} sizePadding={1.2} fontWeight={500}>
                  {!isEditing && <OpenButton />}
                </SurfacePassProps>
              </>
            )}
          </HeaderContain>

          <HeaderSide spaceAround rightSide>
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
              <HeaderButtonPassProps>
                <Button
                  {...om.state.router.appId === 'query-builder' && activeStyle}
                  {...useLocationLink('/app/query-builder')}
                  icon="layers"
                  tooltip="Query Builder"
                />
                <Space size="xs" />
                <Button
                  {...om.state.router.appId === 'apps' && activeStyle}
                  {...useLocationLink('/app/apps')}
                  icon="layout-grid"
                  tooltip="Manage apps"
                />
                <OrbitSpaceSwitch />
              </HeaderButtonPassProps>
            )}

            {isEditing && (
              <HeaderButtonPassProps>
                <Button
                  icon="cog"
                  onClick={() => {
                    console.log('got to app specific settings')
                  }}
                />
              </HeaderButtonPassProps>
            )}
          </HeaderSide>
        </HeaderTop>
        {!isEditing && <HeaderFade />}
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
        open={state.router.isOnSetupApp ? true : state.navVisible}
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
        <Icon
          onMouseEnter={() => actions.setNavHovered(true)}
          onMouseLeave={() => actions.setNavHovered(false)}
          opacity={0.65}
          hoverStyle={{
            opacity: 1,
          }}
          color={invertLightness(theme.color, 0.5)}
          name={state.navHovered || state.navVisible ? 'orbit-home' : `orbit-${icon}`}
          size={22}
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
  const { paneId } = paneManagerStore

  if (!apps.length) {
    return null
  }
  return (
    <OrbitNavHiddenBarChrome {...props}>
      <OrbitNavHiddenBarInner>
        {apps.map(app => {
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
        })}
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

const HeaderSide = gloss<RowProps & { rightSide?: boolean }>(Row, {
  flexFlow: 'row',
  flex: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minWidth: 'max-content',
  rightSide: {
    justifyContent: 'flex-start',
  },
})

const OrbitHeaderEditingBg = gloss<{ isActive?: boolean }>(FullScreen, {
  zIndex: -1,
  transition: 'all ease-in 500ms',
}).theme(({ isActive }, theme) => ({
  background: (isActive && theme.orbitHeaderBackgroundEditing) || 'transparent',
}))

const HeaderContain = gloss<{ isActive?: boolean; isEditing: boolean }>(Box, {
  margin: ['auto', 0],
  alignItems: 'center',
  flexFlow: 'row',
  flex: 20,
  maxWidth: 600,
  padding: [0, 12],
  borderRadius: 100,
}).theme(({ isActive, isEditing }, theme) => ({
  background: isEditing
    ? theme.orbitInputBackgroundEditing
    : isActive
    ? [0, 0, 0, theme.background.isDark() ? 0.1 : 0.075]
    : 'none',
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

const ExtraButtonsChrome = gloss(Box, {
  flexFlow: 'row',
  paddingRight: 22,
  paddingLeft: 12,
  marginRight: -10,
  borderLeftRadius: 12,
})

const OpenButton = memo(() => {
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
    >
      Open
    </Button>
  )
})

const BackButton = memo(() => {
  const { state, actions } = useOm()
  return (
    <Button
      circular
      icon="chevron-left"
      opacity={state.router.history.length ? 0.5 : 0.4}
      iconSize={22}
      onClick={actions.router.back}
    />
  )
})
