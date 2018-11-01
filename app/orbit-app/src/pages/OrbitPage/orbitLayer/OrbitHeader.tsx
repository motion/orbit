import * as React from 'react'
import { view, attach } from '@mcro/black'
import { attachTheme, ThemeObject } from '@mcro/gloss'
import { OrbitHeaderInput } from './OrbitHeaderInput'
import { View } from '@mcro/ui'
import { OrbitSwitch } from './OrbitSwitch'
import { OrbitHeaderButtons } from './OrbitHeaderButtons'
import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../../stores/SelectionStore'
import { AppActions } from '../../../actions/AppActions'

export type HeaderProps = {
  paneManagerStore?: PaneManagerStore
  queryStore?: QueryStore
  selectionStore?: SelectionStore
}

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

export class HeaderStore {
  props: HeaderProps

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
      this.focus()
      await sleep(16)
      this.focus()
    },
  )

  focusInputOnClearQuery = react(
    () => App.state.query,
    query => {
      ensure('no query', !query)
      this.focus()
    },
    {
      log: false,
    },
  )

  blurQueryOnSettingsPane = react(
    () => this.props.paneManagerStore.activePane === 'settings',
    isSettings => {
      ensure('isSettings', isSettings)
      ensure('ref', !!this.inputRef.current)
      this.inputRef.current.blur()
    },
  )

  updateInputOnPaneChange = react(
    () => /home|explore/.test(this.props.paneManagerStore.activePane),
    isSearchablePane => {
      ensure('isSearchablePane', isSearchablePane)
      this.props.queryStore.clearQuery()
      this.focus()
    },
    {
      deferFirstRun: true,
    },
  )

  disableSearch = react(() => this.props.paneManagerStore.activePane === 'settings', _ => _)

  onClickInput = () => {}

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
      AppActions.closeOrbit()
    } else {
      this.props.paneManagerStore.setActivePane('home')
    }
  }
}

@attachTheme
@attach('paneManagerStore', 'selectionStore', 'searchStore', 'queryStore')
@attach({
  headerStore: HeaderStore,
})
@view
export class OrbitHeader extends React.Component<
  HeaderProps & {
    headerStore?: HeaderStore
    after?: React.ReactNode
    borderRadius?: number
    theme?: ThemeObject
    showPin?: boolean
  }
> {
  render() {
    const { headerStore, paneManagerStore, theme, borderRadius } = this.props
    const headerBg = theme.background
    return (
      <OrbitHeaderContainer
        headerBg={headerBg}
        borderRadius={borderRadius}
        opacity={paneManagerStore.shouldOnboard ? 0 : 1}
      >
        <OrbitFakeInput>
          <Title>
            <OrbitClose onClick={AppActions.closeOrbit}>
              <OrbitCloseControl />
            </OrbitClose>
            <OrbitSwitch />
            <Disable when={headerStore.disableSearch}>
              <OrbitHeaderInput headerStore={headerStore} theme={theme} />
            </Disable>
          </Title>
          <After>
            <OrbitHeaderButtons />
          </After>
        </OrbitFakeInput>
      </OrbitHeaderContainer>
    )
  }
}

const OrbitHeaderContainer = view(View, {
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  padding: [9, 7, 7, 7],
  transition: 'all ease-in 300ms',
  zIndex: 4,
})

const After = view({
  alignItems: 'center',
  flexFlow: 'row',
})

const Title = view({
  flexFlow: 'row',
  flex: 1,
  justifyContent: 'stretch',
  alignItems: 'stretch',
})

const OrbitFakeInput = view({
  height: 43,
  flex: 1,
  flexFlow: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  transition: 'background ease-in 200ms 200ms',
  borderRadius: 10,
  inactive: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
}).theme(({ theme }) => ({
  background: theme.inputBackground || theme.background.alpha(0.35),
  '&:active': {
    background: theme.inputBackgroundActive || theme.background.alpha(0.6),
  },
}))

const OrbitCloseControl = view({
  width: 8,
  height: 8,
  borderRadius: 50,
  boxSizing: 'content-box',
  zIndex: 10000,
})

const OrbitClose = view({
  position: 'absolute',
  top: 3,
  left: 3,
  padding: 6,
}).theme(({ theme }) => {
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

const Disable = view({
  flex: 'inherit',
  when: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
})
