import * as React from 'react'
import { StoreContext } from '@mcro/black'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { View } from '@mcro/ui'
import { OrbitHeaderButtons } from './OrbitHeaderButtons'
import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { AppActions } from '../../actions/AppActions'
import { WindowCloseButton } from '../../views/WindowControls'
import { observer } from 'mobx-react-lite'
import { useStore } from '@mcro/use-store'
import { gloss } from '@mcro/gloss'

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

export class HeaderStore {
  props: {
    paneManagerStore?: PaneManagerStore
    queryStore?: QueryStore
    selectionStore?: SelectionStore
  }

  inputRef = React.createRef<HTMLDivElement>()
  iconHovered = false

  get highlightWords() {
    const { activeMarks } = this.props.queryStore.queryFilters
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
    this.props.queryStore.onChangeQuery(this.inputRef.current.innerText)
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
    () => this.props.queryStore.hasQuery,
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
    const activePane = this.props.paneManagerStore.activePane
    if (activePane === 'home' || activePane === 'search') {
      AppActions.setOrbitDocked(false)
    } else {
      this.props.paneManagerStore.setActivePane('home')
    }
  }
}

export const OrbitHeader = observer(() => {
  const stores = React.useContext(StoreContext)
  const headerStore = useStore(HeaderStore, stores)
  return (
    <OrbitHeaderContainer
      opacity={stores.paneManagerStore.activePane === 'onboard' ? 0 : 1}
      className="draggable"
    >
      <OrbitClose onClick={AppActions.closeOrbit}>
        <WindowCloseButton size={8} />
      </OrbitClose>
      <OrbitInputContain>
        <OrbitHeaderInput headerStore={headerStore} />
        <After>
          <OrbitHeaderButtons />
        </After>
      </OrbitInputContain>
    </OrbitHeaderContainer>
  )
})

const OrbitHeaderContainer = gloss(View, {
  position: 'relative',
  flexFlow: 'row',
  padding: [7, 14],
  transition: 'all ease-in 300ms',
  zIndex: 4,
})

const After = gloss({
  alignItems: 'center',
  flexFlow: 'row',
})

const OrbitInputContain = gloss({
  height: 34,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
  flexFlow: 'row',
  maxWidth: 900,
  width: '80%',
  minWidth: 400,
})

const OrbitClose = gloss({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: 4,
  opacity: 0.1,
  '&:hover': {
    opacity: 1,
  },
}).theme((_, theme) => {
  const isDark = theme.background.isDark()
  return {
    '& > div': {
      background: isDark ? 'transparent' : [230, 230, 230, 0.25],
    },
    '&:hover > div': {
      background: isDark ? '#fff' : '#000',
    },
  }
})
