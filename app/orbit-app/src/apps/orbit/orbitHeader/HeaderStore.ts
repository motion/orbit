import * as React from 'react'
import { react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { HeaderProps } from './HeaderProps'

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
      if (hasTarget) {
        throw react.cancel
      }
      this.focus()
      await sleep(16)
      this.focus()
    },
  )

  focusInputOnClearQuery = react(
    () => App.state.query,
    query => {
      if (query) {
        throw react.cancel
      }
      this.focus()
    },
    {
      log: false,
    },
  )

  updateInputOnPaneChange = react(
    () => this.props.paneManagerStore.activePane,
    pane => {
      if (pane === 'search' || pane === 'home') {
        throw react.cancel
      }
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
      App.actions.closeOrbit()
    } else {
      if (App.state.query) {
        this.props.queryStore.clearQuery()
      } else {
        this.props.paneManagerStore.setActivePane('home')
      }
    }
  }
}
