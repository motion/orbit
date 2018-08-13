import * as React from 'react'
import { react } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { SearchStore } from '../../../stores/SelectionStore'
import { PaneManagerStore } from '../PaneManagerStore'

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

export class HeaderStore {
  props: {
    searchStore: SearchStore
    paneManagerStore: PaneManagerStore
  }

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

  // not based on real focus because when you scroll down and select it technically
  // focuses on the list items but still lets you type
  // also needs to be
  isInputFocused = react(
    () => [App.orbitState.inputFocused, this.props.searchStore.nextIndex],
    ([focused, nextIndex]) => {
      return focused && nextIndex === -1
    },
    { immediate: true },
  )

  onInput = () => {
    if (!this.inputRef.current) {
      return
    }
    this.props.searchStore.onChangeQuery(this.inputRef.current.innerText)
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
      if (!shown) {
        throw react.cancel
      }
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
      this.props.searchStore.clearQuery()
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
        this.props.searchStore.clearQuery()
      } else {
        this.props.paneManagerStore.setActivePane('home')
      }
    }
  }
}
