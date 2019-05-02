import { invertLightness } from '@o/color'
import { FullScreen, gloss, useTheme } from '@o/gloss'
import { Icon } from '@o/kit'
import { isEditing } from '@o/stores'
import { BorderBottom, Button, ButtonProps, Popover, PopoverProps, Row, Space, SurfacePassProps, View } from '@o/ui'
import React, { memo, useCallback, useState } from 'react'

import { useActions } from '../../hooks/useActions'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { OrbitSpaceSwitch } from '../../views/OrbitSpaceSwitch'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitHeaderMenu } from './OrbitHeaderMenu'
import { OrbitNav } from './OrbitNav'

// import { clipboard } from 'electron'
export const headerButtonProps = {
  chromeless: true,
  margin: [-1, 1],
  opacity: 0.75,
  hoverStyle: { opacity: 1 },
  iconSize: 14,
}

const HeaderButtonPassProps = (props: any) => <SurfacePassProps {...headerButtonProps} {...props} />

export const OrbitHeader = memo(function OrbitHeader() {
  const { orbitStore, headerStore, newAppStore, paneManagerStore } = useStores()
  const { activePane } = paneManagerStore
  const activePaneType = activePane.type
  const icon = activePaneType === 'createApp' ? newAppStore.app.identifier : activePaneType
  const theme = useTheme()
  const isOnSettings = activePaneType === 'settings' || activePaneType === 'spaces'
  const isOnTearablePane = activePaneType !== activePane.id
  const [hoveringIcon, setHoveringIcon] = useState(false)
  const onEnterIcon = useCallback(() => setHoveringIcon(true), [])
  const onLeaveIcon = useCallback(() => setHoveringIcon(false), [])

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
          <HeaderButtonPassProps>
            <BackButton />
            <OrbitHeaderMenu />
          </HeaderButtonPassProps>
        </HeaderSide>

        <HeaderContain isActive={false}>
          <View width={20} margin={[0, 6]} alignItems="center" justifyContent="center">
            <OrbitNavPopover
              open={paneManagerStore.isOnHome ? true : undefined}
              target={
                <Icon
                  onMouseEnter={onEnterIcon}
                  onMouseLeave={onLeaveIcon}
                  opacity={0.65}
                  hoverStyle={{
                    opacity: 1,
                  }}
                  color={invertLightness(theme.color, 0.5)}
                  name={hoveringIcon ? 'orbit-home' : `orbit-${icon}`}
                  size={22}
                  onClick={e => {
                    console.log('go to ', hoveringIcon, paneManagerStore.homePane.id)
                    if (hoveringIcon) {
                      e.stopPropagation()
                      paneManagerStore.setActivePane(paneManagerStore.homePane.id)
                    }
                  }}
                />
              }
            >
              <OrbitNav />
            </OrbitNavPopover>
          </View>

          <OrbitHeaderInput />

          {isOnTearablePane && (
            <>
              {!!orbitStore.activeActions && (
                <ExtraButtonsChrome>
                  <HeaderButtonPassProps>{orbitStore.activeActions || null}</HeaderButtonPassProps>
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
              active={paneManagerStore.activePane.id === 'data-explorer'}
              onClick={() => paneManagerStore.setActivePane('data-explorer')}
              icon="layers"
              tooltip="Data explorer"
            />
            <Button
              active={paneManagerStore.activePane.id === 'apps'}
              onClick={() => paneManagerStore.setActivePane('apps')}
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
  )
})

const OrbitNavPopover = ({ children, target, ...rest }: PopoverProps) => {
  return (
    <Popover
      group="orbit-nav"
      target={target}
      // openOnClick
      openOnHover
      // closeOnClick
      width={window.innerWidth * 0.8}
      padding={3}
      elevation={2}
      distance={8}
      sizeRadius
      background={theme => theme.backgroundStronger}
      adjust={[100, 0]}
      {...rest}
    >
      {children}
    </Popover>
  )
}

const OrbitHeaderContainer = gloss<any>(View, {
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

const ExtraButtonsChrome = gloss({
  flexFlow: 'row',
  paddingRight: 22,
  paddingLeft: 12,
  marginRight: -10,
  borderLeftRadius: 12,
}).theme((_, theme) => ({
  borderLeft: [1, theme.background.alpha(0.5)],
  borderBottom: [1, theme.background.alpha(0.5)],
  borderTop: [1, theme.background.alpha(0.5)],
}))

const OpenButton = memo(() => {
  const Actions = useActions()
  // const [_isHovered, setHovered] = useState(false)
  // const tm = useRef(null)

  if (isEditing) {
    return null
  }

  return (
    <Button
      icon="chevron-right"
      alt="action"
      iconSize={18}
      sizeRadius={1.6}
      borderWidth={1.5}
      glint={false}
      iconAfter
      tooltip="Open to desktop (⌘ + ⏎)"
      onClick={Actions.tearApp}
    />
  )
})

const BackButton = memo(() => {
  const { locationStore } = useStoresSimple()
  return (
    <Button
      circular
      icon="chevron-left"
      opacity={locationStore.history.length ? 0.5 : 0.4}
      iconSize={22}
      onClick={() => {
        locationStore.back()
      }}
    />
  )
})
