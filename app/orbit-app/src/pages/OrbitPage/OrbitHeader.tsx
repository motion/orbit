import { invertLightness } from '@o/color'
import { Icon, useActiveAppsSorted, useLocationLink } from '@o/kit'
import { isEditing } from '@o/stores'
import { BorderBottom, Button, ButtonProps, Popover, PopoverProps, Row, Space, SurfacePassProps, View } from '@o/ui'
import { FullScreen, gloss, useTheme } from 'gloss'
import React, { forwardRef, memo } from 'react'

import { useStores } from '../../hooks/useStores'
import { useOm } from '../../om/om'
import { OrbitSpaceSwitch } from '../../views/OrbitSpaceSwitch'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitHeaderMenu } from './OrbitHeaderMenu'
import { OrbitNav } from './OrbitNav'

// import { clipboard } from 'electron'
export const headerButtonProps = {
  chromeless: true,
  margin: [-1, 2],
  opacity: 0.75,
  hoverStyle: { opacity: 1 },
  iconSize: 14,
}

const HeaderButtonPassProps = (props: any) => <SurfacePassProps {...headerButtonProps} {...props} />

const HomeButton = memo(
  forwardRef((props: any, ref) => {
    const { state, actions } = useOm()
    const theme = useTheme()
    const { newAppStore, paneManagerStore } = useStores()
    const { activePane } = paneManagerStore
    const activePaneType = activePane.type
    const icon = activePaneType === 'setupApp' ? newAppStore.app.identifier : activePaneType

    return (
      <Icon
        ref={ref}
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
        {...props}
      />
    )
  }),
)

const activeStyle = {
  opacity: 1,
}

export const OrbitHeader = memo(() => {
  const { orbitStore, headerStore, newAppStore, paneManagerStore } = useStores()
  const { isTorn } = orbitStore
  const { activePane } = paneManagerStore
  const activePaneType = activePane.type
  const theme = useTheme()
  const isOnSettings = activePaneType === 'settings' || activePaneType === 'spaces'
  const isOnTearablePane = activePaneType !== activePane.id

  return (
    <>
      <OrbitHeaderContainer
        isEditing={isTorn}
        className="draggable"
        onMouseUp={headerStore.handleMouseUp}
      >
        <OrbitHeaderEditingBg isActive={isTorn} />

        <HeaderTop height={isTorn ? 46 : 64} padding={isTorn ? [3, 10] : [5, 10]}>
          <HeaderSide>
            <View flex={1} />
            <HeaderButtonPassProps>
              <BackButton />
              <OrbitHeaderMenu />
            </HeaderButtonPassProps>
          </HeaderSide>

          <HeaderContain isActive={false}>
            <View width={20} margin={[0, 6]} alignItems="center" justifyContent="center">
              <OrbitNavPopover target={<HomeButton id="home-button" />}>
                <OrbitNav />
              </OrbitNavPopover>
            </View>

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

          <HeaderSide rightSide>
            <HeaderButtonPassProps>
              <View flex={1} />

              {isEditing && (
                <Row>
                  <HeaderButton icon="edit" tooltip="Open in VSCode" />
                  <Space />
                  <HeaderButton alt="action" tooltip="Deploy to space">
                    Publish
                  </HeaderButton>
                </Row>
              )}

              <Button
                {...paneManagerStore.activePane.id === 'data-explorer' && activeStyle}
                {...useLocationLink('/app/data-explorer')}
                icon="layers"
                tooltip="Data explorer"
              />
              <Button
                {...paneManagerStore.activePane.id === 'apps' && activeStyle}
                {...useLocationLink('/app/apps')}
                icon="layout-grid"
                tooltip="Manage apps"
              />

              {!isEditing && <OrbitSpaceSwitch />}

              {isEditing && (
                <Button
                  chromeless
                  opacity={isOnSettings ? 0.8 : 0.4}
                  hoverStyle={{
                    opacity: isOnSettings ? 1 : 0.6,
                  }}
                  icon="cog"
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
            </HeaderButtonPassProps>
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
  return (
    <>
      <OrbitNavHiddenBar
        isVisible={state.navVisible}
        onClick={() => actions.setNavVisible(!state.navVisible)}
      />
      <Popover
        group="orbit-nav"
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
        adjust={[80, 0]}
        {...rest}
      >
        {children}
      </Popover>
    </>
  )
}

const OrbitNavHiddenBar = props => {
  const apps = useActiveAppsSorted().slice(0, 20)
  const { paneManagerStore } = useStores()
  const { activePaneId } = paneManagerStore

  if (!apps.length) {
    return null
  }
  return (
    <OrbitNavHiddenBarChrome {...props}>
      <OrbitNavHiddenBarInner isVisible={props.isVisible}>
        {apps.map(app => {
          const isActive = activePaneId === `${app.id}`
          return (
            <div
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

const OrbitNavHiddenBarChrome = gloss({
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

const OrbitNavHiddenBarInner = gloss({
  flexFlow: 'row',
  height: 3,
  borderRadius: 3,
  padding: [0, '20%'],
  width: '100%',
}).theme((_, theme) => ({
  background: theme.backgroundStrongest.alpha(0.5),
}))

const OrbitHeaderContainer = gloss<any>(View, {
  position: 'relative',
  overflow: 'hidden',
  zIndex: 0,
}).theme((props, theme) => ({
  // borderBottom: [1, theme.borderColor],
  background:
    // 'rgba(0,50, 200, 0.2)' ||
    (props.isEditing && theme.headerBackgroundOpaque) ||
    theme.headerBackground ||
    theme.background.alpha(a => a * 0.65),
}))

const HeaderSide = gloss({
  flexFlow: 'row',
  width: '15%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  // padding: [0, 0, 0, 20],
  rightSide: {
    padding: [0, 20, 0, 0],
    justifyContent: 'flex-end',
  },
})

function HeaderButton(props: ButtonProps) {
  return <Button size={0.9} sizeHeight={0.9} {...props} />
}

const OrbitHeaderEditingBg = gloss<{ isActive?: boolean }>(FullScreen, {
  zIndex: -1,
  transition: 'all ease-in 500ms',
}).theme(({ isActive }, theme) => ({
  background: (isActive && theme.orbitHeaderBackgroundEditing) || 'transparent',
}))

const HeaderContain = gloss<{ isActive?: boolean }>({
  margin: 'auto',
  alignItems: 'center',
  flexFlow: 'row',
  width: 'calc(100% - 300px)',
  maxWidth: 800,
  minWidth: 400,
  padding: [0, 5],
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

const ExtraButtonsChrome = gloss({
  flexFlow: 'row',
  paddingRight: 22,
  paddingLeft: 12,
  marginRight: -10,
  borderLeftRadius: 12,
})

const OpenButton = memo(() => {
  const { effects } = useOm()

  if (isEditing) {
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
