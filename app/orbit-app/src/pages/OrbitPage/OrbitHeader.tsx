import { ensure, react } from '@mcro/black'
import { Absolute, FullScreen, gloss } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Button, ClearButton, Icon, Row, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
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
  const { orbitStore, queryStore, paneManagerStore } = useStoresSafe()
  const headerStore = useStore(HeaderStore)
  return (
    <OrbitHeaderContainer
      opacity={paneManagerStore.activePane.type === 'onboard' ? 0 : 1}
      className="draggable"
      onMouseUp={headerStore.handleMouseUp}
    >
      <HeaderTop padding={orbitStore.isTorn ? [2, 10] : [4, 10]}>
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
          <FakeInput>
            <OrbitHeaderInput headerStore={headerStore} />
            <After>
              {queryStore.hasQuery && <ClearButton onClick={queryStore.clearQuery} />}
              {/* <OrbitHeaderButtons /> */}
            </After>
          </FakeInput>
          {!orbitStore.isTorn && (
            <Button
              chromeless
              isActive={paneManagerStore.activePane.type === 'settings'}
              onClick={paneManagerStore.activePaneByTypeSetter('settings')}
              tooltip="Settings"
            >
              <Icon name="gear" size={12} opacity={0.45} hoverOpacity={0.5} />
            </Button>
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
  background: theme.background.alpha(0.72),
}))

const OrbitHeaderDivider = gloss<{ torn?: boolean }>({
  height: 1,
}).theme(({ torn }, theme) => ({
  background: torn ? theme.borderColor.alpha(0.5) : theme.tabBackground,
}))

const HeaderTop = gloss(View, {
  padding: [4, 10],
  flexFlow: 'row',
  transition: 'all ease-in 300ms',
  position: 'relative',
})

const OrbitHeaderBg = gloss(FullScreen, {
  zIndex: -1,
  pointerEvents: 'none',
}).theme((_, theme) => ({
  background: `linear-gradient(${theme.background.alpha(0.35)}, transparent)`,
}))

const After = gloss({
  alignItems: 'center',
  flexFlow: 'row',
})

const FakeInput = gloss({
  height: 32,
  padding: [0, 10],
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
  flexFlow: 'row',
  maxWidth: 700,
  width: '70%',
  minWidth: 400,
  cursor: 'text',
  transition: 'none',
  '&:active': {
    background: [0, 0, 0, 0.025],
    transition: 'all ease-out 350ms 350ms',
  },
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
