import { ensure, react } from '@mcro/black'
import { Absolute, FullScreen, gloss } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Button, Icon, Row, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { OrbitToolBarRender } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { WindowControls } from '../../views/WindowControls'
import OrbitHeaderInput from './OrbitHeaderInput'
import OrbitNav from './OrbitNav'
import OrbitSwitch from './OrbitSpaceSwitch'

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

export class HeaderStore {
  stores = useHook(useStoresSafe)
  mouseUpAt = 0
  inputRef = React.createRef<HTMLDivElement>()
  iconHovered = false

  get highlightWords() {
    const { activeMarks } = this.stores.queryStore.queryFilters
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
    this.stores.queryStore.onChangeQuery(this.inputRef.current.innerText)
  }

  focus = () => {
    if (!this.inputRef || !this.inputRef.current) {
      return
    }
    this.inputRef.current.focus()
    moveCursorToEndOfTextarea(this.inputRef.current)
  }

  focusInputOnVisible = react(
    () => App.orbitState.pinned || App.orbitState.docked,
    async (shown, { sleep }) => {
      ensure('shown', shown)
      ensure('ref', !!this.inputRef.current)
      // wait for after it shows
      await sleep(16)
      this.focus()
      selectTextarea(this.inputRef.current)
    },
  )

  focusInputOnClosePeek = react(
    () => !!App.peekState.target,
    async (hasTarget, { sleep }) => {
      ensure('no target', !hasTarget)
      await sleep(16)
      this.focus()
    },
  )

  focusInputOnClearQuery = react(
    () => this.stores.queryStore.hasQuery,
    query => {
      ensure('no query', !query)
      this.focus()
    },
    {
      log: false,
    },
  )

  onHoverIcon = () => {
    this.iconHovered = true
  }

  onUnHoverIcon = () => {
    this.iconHovered = false
  }

  onClickOrb = () => {
    App.sendMessage(App, App.messages.HIDE)
    // App.sendMessage(Desktop, Desktop.messages.TOGGLE_OCR)
  }

  goHome = () => {
    const activePane = this.stores.paneManagerStore.activePane
    if (activePane.type === 'home' || activePane.type === 'search') {
      AppActions.setOrbitDocked(false)
    } else {
      this.stores.paneManagerStore.setActivePaneByType('home')
    }
  }

  handleMouseUp = () => {
    setTimeout(() => {
      if (this.inputRef.current) {
        this.inputRef.current.focus()
      }
    })
  }
}

export default observer(function OrbitHeader() {
  const { orbitStore, paneManagerStore } = useStoresSafe()
  const headerStore = useStore(HeaderStore)
  const isOnSettings = paneManagerStore.activePane.type === 'settings'
  const settingsIconActiveOpacityInc = isOnSettings ? 0.4 : 0
  return (
    <OrbitHeaderContainer
      opacity={paneManagerStore.activePane.type === 'onboard' ? 0 : 1}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
    >
      <HeaderTop padding={orbitStore.isTorn ? [2, 10] : [6, 10]}>
        <OrbitClose dontDim={orbitStore.isTorn} onClick={AppActions.closeOrbit}>
          <WindowControls
            itemProps={{ size: 10 }}
            onClose={() => console.log('close')}
            onMin={orbitStore.isTorn ? () => console.log('min') : null}
            onMax={orbitStore.isTorn ? () => console.log('min') : null}
          />
        </OrbitClose>
        <Row flex={1} alignItems="center">
          <Row flex={1} />
          {!orbitStore.isTorn && <OrbitSwitch />}
          {orbitStore.isTorn && <OrbitToolBarRender.Before />}
          <OrbitHeaderInput headerStore={headerStore} />
          {orbitStore.isTorn && <OrbitToolBarRender.After />}
          {!orbitStore.isTorn && (
            // <Absolute top={0} right={0}>
            <Button
              chromeless
              isActive={isOnSettings}
              onClick={() => {
                if (isOnSettings) {
                  paneManagerStore.back()
                } else {
                  paneManagerStore.setActivePaneByType('settings')
                }
              }}
              tooltip="Settings"
            >
              <Icon
                name="gear"
                size={14}
                opacity={0.2 + settingsIconActiveOpacityInc}
                hoverStyle={{
                  opacity: 0.5 + settingsIconActiveOpacityInc,
                }}
              />
            </Button>
            // </Absolute>
          )}
          <Row flex={1} />
        </Row>

        <OrbitAutoComplete />
      </HeaderTop>

      <OrbitNav />
      <OrbitHeaderDivider torn={orbitStore.isTorn} />
      <OrbitHeaderBg />
    </OrbitHeaderContainer>
  )
})

const OrbitAutoComplete = observer(function OrbitAutoComplete() {
  const { orbitStore } = useStoresSafe()
  const activeAppStore = orbitStore.appStores[orbitStore.activePane.id]
  return null
  return (
    <Absolute bottom={0} left={0}>
      {activeAppStore.toolbar || null}
    </Absolute>
  )
})

const OrbitHeaderContainer = gloss(View, {
  position: 'relative',
  zIndex: 4,
}).theme((_, theme) => ({
  background: theme.headerBackground || theme.background.alpha(0.65),
}))

const OrbitHeaderDivider = gloss<{ torn?: boolean }>({
  height: 1,
}).theme(({ torn }, theme) => ({
  background: torn ? theme.borderColor.alpha(0.5) : theme.tabBackground,
}))

const HeaderTop = gloss(View, {
  flexFlow: 'row',
  position: 'relative',
})

const OrbitHeaderBg = gloss(FullScreen, {
  zIndex: -1,
  pointerEvents: 'none',
}).theme((_, theme) => ({
  background: `linear-gradient(${theme.background.alpha(0.3)},${theme.background.alpha(0)})`,
}))

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
