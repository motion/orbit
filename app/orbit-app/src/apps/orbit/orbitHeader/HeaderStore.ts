import * as React from 'react'
import { react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
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
    async shown => {
      ensure('shown', shown)
      ensure('ref', !!this.inputRef.current)
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

  onClickInput = () => {
    if (!App.orbitState.pinned && Desktop.isHoldingOption) {
      App.togglePinned()
    }
  }

  onHoverIcon = () => {
    this.iconHovered = true
  }

  onUnHoverIcon = () => {
    this.iconHovered = false
  }

  goHome = () => {
    if (this.props.paneManagerStore.activePane === 'home') {
      Actions.closeOrbit()
    } else {
      if (App.state.query) {
        this.props.queryStore.clearQuery()
      } else {
        this.props.paneManagerStore.setActivePane('home')
      }
    }
  }
}
