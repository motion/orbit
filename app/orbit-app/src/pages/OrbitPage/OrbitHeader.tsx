import { AppIcon, useLocationLink, useStore } from '@o/kit'
import { App, Electron } from '@o/stores'
import { BorderBottom, Button, ButtonProps, MenuButton, Popover, PopoverProps, Row, RowProps, SizedSurfaceProps, Space, SurfacePassProps, View } from '@o/ui'
import { createUsableStore, ensure, react } from '@o/use-store'
import { FullScreen, gloss, useTheme } from 'gloss'
import React, { forwardRef, memo, useMemo } from 'react'
import { createRef, useRef } from 'react'

import { useOm } from '../../om/om'
import { queryStore, useNewAppStore, useOrbitStore, usePaneManagerStore } from '../../om/stores'
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

const activeStyle = {
  opacity: 1,
}

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

class HeaderStore {
  mouseUpAt = 0
  inputRef = createRef<HTMLDivElement>()
  iconHovered = false

  get highlightWords() {
    const { activeMarks } = queryStore.queryFilters
    if (!activeMarks) {
      return null
    }
    const markPositions = activeMarks.map(x => [x[0], x[1]])
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
export const useHeaderStore = headerStore.useStore

export const OrbitHeader = memo(() => {
  const containerRef = useRef()
  const orbitStore = useOrbitStore()
  const theme = useTheme()
  const isOnTearablePane = !useIsOnStaticApp()
  const { appRole } = useStore(App)
  const queryBuilderLink = useLocationLink('/app/query-builder')
  const appsLink = useLocationLink('/app/apps')

  const isEditing = appRole === 'editing'
  const isTorn = appRole === 'torn'
  const slim = isEditing || isTorn

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
      isEditing={isEditing}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
    >
      <OrbitHeaderEditingBg isActive={isEditing} />

      <HeaderTop height={slim ? 46 : 56}>
        <HeaderButtonPassProps>
          <HeaderSide space="sm" spaceAround slim={slim}>
            {!slim && <BackButton />}
            <OrbitHeaderMenu />
            {homeButtonElement}
          </HeaderSide>
        </HeaderButtonPassProps>

        <HeaderContain space spaceAround isActive={false} isEditing={isEditing}>
          <OrbitHeaderInput fontSize={slim ? 16 : 18} />

          {isOnTearablePane && (
            <>
              <SurfacePassProps sizeRadius={1.5} sizeHeight={0.9} sizeIcon={1.1} sizePadding={1.2}>
                {orbitStore.activeActions}
              </SurfacePassProps>
              {!isEditing && !isTorn && <OpenButton>Open</OpenButton>}
            </>
          )}
        </HeaderContain>

        <HeaderButtonPassProps>
          <HeaderSide space="sm" spaceAround justifyContent="flex-start" slim={slim}>
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

            {!isEditing && !isTorn && (
              <>
                <OrbitButton
                  appId="query-builder"
                  activeStyle={activeStyle}
                  onClick={queryBuilderLink}
                  icon="layers"
                  tooltip="Query Builder"
                />
                <OrbitButton
                  appId="apps"
                  activeStyle={activeStyle}
                  onClick={appsLink}
                  icon="layout-grid"
                  tooltip="Manage apps"
                />
                <OrbitSpaceSwitch />
              </>
            )}

            {(isEditing || isTorn) && (
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
  )
})

const OrbitButton = ({
  appId,
  activeStyle,
  ...props
}: ButtonProps & { appId?: string; activeStyle?: Partial<ButtonProps> }) => {
  const om = useOm()
  const isActive = appId ? om.state.router.appId === appId : false
  return <Button {...props} {...isActive && activeStyle} />
}

const OrbitNavPopover = ({ children, target, ...rest }: PopoverProps) => {
  const { state, actions } = useOm()
  return (
    <>
      {/* <OrbitNavHiddenBar
        isVisible={state.navVisible}
        onClick={() => actions.setNavVisible(!state.navVisible)}
      /> */}
      <Popover
        openKey="orbit-nav"
        target={target}
        openOnClick
        openOnHover
        onHover={actions.setNavVisible}
        onChangeVisibility={actions.setNavVisible}
        open={state.navVisible}
        maxWidth="80vw"
        padding={0}
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
    const newAppStore = useNewAppStore()
    const paneManagerStore = usePaneManagerStore()
    const { activePane } = paneManagerStore
    const activePaneType = activePane.type
    const icon = activePaneType === 'setupApp' ? newAppStore.app.identifier : activePaneType
    return (
      <View ref={ref} {...props}>
        <AppIcon
          cutout
          colors={[theme.color.toString(), theme.color.toString()]}
          onMouseEnter={() => actions.setNavHovered(true)}
          onMouseLeave={() => actions.setNavHovered(false)}
          opacity={0.5}
          hoverStyle={{
            opacity: 1,
          }}
          identifier={state.navHovered ? 'home' : icon}
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

const HeaderSide = gloss<RowProps & { slim?: boolean }>(Row, {
  flexFlow: 'row',
  flex: 1,
  width: '18%',
  minWidth: 150,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'flex-end',

  slim: {
    flex: 'none',
    width: 'auto',
    minWidth: 'min-content',
  },
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

const OpenButton = memo((props: ButtonProps) => {
  const { effects } = useOm()
  const { appRole } = useStore(App)

  if (appRole !== 'main') {
    return null
  }

  return (
    <MenuButton
      alt="action"
      size={1}
      sizeRadius={1.6}
      tooltip="Open to desktop (⌘ + ⏎)"
      onClick={effects.openCurrentApp}
      items={[
        {
          title: 'Edit',
          icon: 'edit',
        },
        {
          title: 'Fork',
          icon: 'fork',
        },
      ]}
      {...props}
    />
  )
})

const BackButton = memo(() => {
  const { state, actions } = useOm()
  return (
    <Button
      icon="chevron-left"
      disabled={state.router.historyIndex <= 0}
      iconSize={18}
      onClick={actions.router.back}
    />
  )
})
