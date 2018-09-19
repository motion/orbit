import * as React from 'react'
import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { HeaderProps } from './HeaderProps'
import { Actions } from '../../../actions/Actions'

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
    const { activeMarks } = this.props.searchStore.searchFilterStore
    if (!activeMarks) {
      return null
    }
    return () => activeMarks
  }

  get placeholder() {
    const { activePane } = this.props.paneManagerStore
    if (activePane === 'apps') {
      return 'Find apps...'
    }
    if (activePane === 'directory') {
      return 'Search people...'
    }
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

  updateInputOnPaneChange = react(
    () => this.props.paneManagerStore.activePane,
    pane => {
      ensure('pane not search or home', pane !== 'search' && pane !== 'home')
      this.props.queryStore.clearQuery()
      this.focus()
    },
  )

  onClickInput = () => {}

  onHoverIcon = () => {
    this.iconHovered = true
  }

  onUnHoverIcon = () => {
    this.iconHovered = false
  }

  goHome = () => {
    const activePane = this.props.paneManagerStore.activePane
    if (activePane === 'home' || activePane === 'search') {
      Actions.closeOrbit()
    } else {
      this.props.paneManagerStore.setActivePane('home')
    }
  }
}
