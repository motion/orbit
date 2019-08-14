import { AppIcon, useModels, useStore } from '@o/kit'
import { BuildStatusModel } from '@o/models'
import { App, Electron } from '@o/stores'
import { BorderBottom, Button, Popover, PopoverProps, Row, RowProps, SizedSurfaceProps, SurfacePassProps, View } from '@o/ui'
import { createUsableStore, ensure, react, useReaction } from '@o/use-store'
import { BoxProps, FullScreen, gloss, useTheme } from 'gloss'
import { createRef, useRef } from 'react'
import React, { forwardRef, memo, useEffect, useMemo, useState } from 'react'

import { useIsOnStaticApp } from '../../hooks/seIsOnStaticApp'
import { useOm } from '../../om/om'
import { queryStore, useNewAppStore, useOrbitStore, usePaneManagerStore } from '../../om/stores'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarousel'
import { appsDrawerStore } from './OrbitAppsDrawer'
import { orbitDockStore } from './OrbitDock'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { OrbitHeaderOpenAppMenu } from './OrbitHeaderOpenAppMenu'
import { OrbitNav } from './OrbitNav'

export const headerButtonProps: SizedSurfaceProps = {
  circular: true,
  background: 'transparent',
  glint: false,
  glintBottom: false,
  borderWidth: 0,
  margin: [-1, 2],
  opacity: 0.75,
  hoverStyle: { opacity: 1, background: theme => theme.backgroundStronger },
  transition: 'all ease 200ms',
  tooltipProps: {
    distance: 18,
  },
  iconSize: 14,
  activeStyle: false,
}

const HeaderButtonPassProps = (props: any) => {
  return <SurfacePassProps {...headerButtonProps} {...props} />
}

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

class HeaderStore {
  inputRef = createRef<HTMLDivElement>()

  get highlightWords() {
    const { activeMarks } = queryStore.queryFilters
    if (!activeMarks) {
      return
    }
    const markPositions = activeMarks.map(x => [x[0], x[1], x[2]])
    return () => markPositions
  }

  onInput = () => {
    if (!this.inputRef.current) {
      return
    }
    queryStore.setQuery(this.inputRef.current.innerText)
  }

  focus = () => {
    if (!this.inputRef || !this.inputRef.current) {
      return
    }
    if (document.activeElement === this.inputRef.current) {
      return
    }
    this.inputRef.current.focus()
    moveCursorToEndOfTextarea(this.inputRef.current)
  }

  focusInputOnVisible = react(
    () => Electron.state.showOrbitMain,
    async (shown, { sleep }) => {
      ensure('shown', shown)
      ensure('ref', !!this.inputRef.current)
      // wait for after it shows
      await sleep(40)
      this.focus()
      selectTextarea(this.inputRef.current)
    },
  )

  focusInputOnClearQuery = react(
    () => queryStore.hasQuery,
    query => {
      ensure('no query', !query)
      this.focus()
    },
  )

  handleMouseUp = async () => {
    window['requestIdleCallback'](() => {
      this.focus()
    })
  }
}

export const headerStore = createUsableStore(HeaderStore)
window['headerStore'] = headerStore
export const useHeaderStore = headerStore.useStore

export const OrbitHeader = memo(() => {
  const om = useOm()
  const containerRef = useRef()
  const appCarousel = useAppsCarousel()
  const orbitStore = useOrbitStore()
  const theme = useTheme()
  const isOnTearablePane = !useIsOnStaticApp()
  const appRole = useReaction(() => App.appRole)

  // TODO this model isn't database backed so no optimistic updating,
  // perhaps we can have a generic react hook/pattern here to handle the optimistic updates
  const [buildStatus] = useModels(BuildStatusModel)
  const [isDeveloping, setIsDeveloping] = useState(false)
  const serverIsDeveloping = buildStatus.some(
    s =>
      s.identifier === (appCarousel.focusedApp ? appCarousel.focusedApp.identifier! : '') &&
      s.mode === 'development',
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

  return (
    <OrbitHeaderContainer
      ref={containerRef}
      isDeveloping={isDeveloping}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
      background={appCarousel.zoomedIn ? undefined : 'transparent'}
    >
      <OrbitHeaderEditingBg isActive={isDeveloping} />

      <HeaderTop height={slim ? 46 : 56}>
        <HeaderButtonPassProps>
          <HeaderSide space="sm" slim={slim}>
            <BackButton isTorn={isTorn} />
            {homeButtonElement}
          </HeaderSide>
        </HeaderButtonPassProps>

        <HeaderContain space spaceAround isActive={false} isDeveloping={isDeveloping}>
          <OrbitHeaderInput fontSize={slim ? 16 : 18} />

          <Row
            space
            transition="all ease 300ms"
            {...!isOnTearablePane &&
              appCarousel.zoomedIn && { pointerEvents: 'none', opacity: 0.3 }}
          >
            <SurfacePassProps sizeRadius={1.5} sizeHeight={0.9} sizeIcon={1.1} sizePadding={1.2}>
              {orbitStore.activeActions}
            </SurfacePassProps>
            {!isTorn && (
              <Button
                circular
                tooltip="Add app to workspace"
                tooltipProps={{
                  distance: 16,
                }}
                alt="flat"
                icon="plus"
                size="sm"
                sizeIcon={1.6}
                glint={false}
                glintBottom={false}
                opacity={0.5}
                hoverStyle={{
                  opacity: 0.75,
                }}
                onClick={om.actions.router.toggleSetupAppPage}
              />
            )}
            <OrbitHeaderOpenAppMenu isDeveloping={isDeveloping} setIsDeveloping={setIsDeveloping} />
          </Row>
        </HeaderContain>

        <HeaderSide space="sm" spaceAround="md" justifyContent="flex-start" slim={slim}>
          <View flex={1} />
          <OrbitDockOpenButton />
        </HeaderSide>
      </HeaderTop>

      {/* this stays slightly below the active tab and looks nice */}
      <BorderBottom
        borderColor={(isDeveloping && theme.headerBorderBottom) || theme.borderColor}
        zIndex={0}
        opacity={0.5}
      />
    </OrbitHeaderContainer>
  )
})

const OrbitDockOpenButton = memo(() => {
  const orbitDock = orbitDockStore.useStore()
  return (
    <View position="relative">
      <HeaderButtonPassProps>
        <Button
          margin={[0, 20, 0, 0]}
          width={30}
          height={30}
          icon="selection"
          iconSize={18}
          iconProps={{
            transform: {
              rotate: '90deg',
            },
          }}
          circular
          onMouseEnter={orbitDock.hoverEnter}
          onMouseLeave={orbitDock.hoverLeave}
          onClick={orbitDock.togglePinned}
          {...orbitDock.state === 'pinned' && {
            background: [0, 0, 0, 0.3],
          }}
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

const OpenButtonExtraArea = gloss<BoxProps & { isOpen: boolean }>({
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
    const newAppStore = useNewAppStore()
    const paneManager = usePaneManagerStore()
    const activePane = paneManager.activePane
    const activePaneType = activePane.type
    const icon = activePaneType === 'setupApp' ? newAppStore.app.identifier : activePaneType
    return (
      <View ref={ref} {...props}>
        <AppIcon
          cutout
          colors={[theme.color.toString(), theme.color.toString()] as any}
          onMouseEnter={() => actions.setNavHovered(true)}
          onMouseLeave={() => actions.setNavHovered(false)}
          opacity={0.5}
          hoverStyle={{
            opacity: 1,
          }}
          identifier={icon}
          size={28}
          onMouseUp={e => {
            e.stopPropagation()
            if (appsDrawerStore.isOpen) {
              appsDrawerStore.closeDrawer()
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
  zIndex: 0,
}).theme((props, theme) => ({
  background:
    props.background ||
    (props.isDeveloping && theme.headerBackgroundOpaque) ||
    theme.headerBackground ||
    theme.background,
}))

const HeaderSide = gloss<RowProps & { slim?: boolean }>(Row, {
  flexFlow: 'row',
  flex: 1,
  width: '10%',
  minWidth: 110,
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

const HeaderContain = gloss<RowProps & { isActive?: boolean; isDeveloping: boolean }>(Row, {
  margin: ['auto', 0],
  alignItems: 'center',
  flex: 20,
  maxWidth: 900,
  borderRadius: 100,
}).theme(({ isActive }, theme) => ({
  background: isActive ? [0, 0, 0, theme.background.isDark() ? 0.1 : 0.075] : 'none',
}))

const HeaderTop = gloss(View, {
  flexFlow: 'row',
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
          appsDrawerStore.closeDrawer()
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
