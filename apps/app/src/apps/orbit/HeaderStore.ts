import * as React from 'react'
import { react } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { SearchStore } from '../../stores/SearchStore'
import { PaneManagerStore } from './PaneManagerStore'

const moveCursorToEndOfTextarea = textarea => {
  textarea.setSelectionRange(textarea.value.length, textarea.value.length)
}

export class HeaderStore {
  props: {
    searchStore: SearchStore
    paneStore: PaneManagerStore
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
    async (shown, { when }) => {
      if (!shown) {
        throw react.cancel
      }
      this.focus()
      await when(() => Desktop.state.focusedOnOrbit)
      this.focus()
    },
    {
      log: false,
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
    if (this.props.paneStore.activePane === 'home') {
      App.actions.closeOrbit()
    } else {
      if (App.state.query) {
        this.props.searchStore.clearQuery()
      } else {
        this.props.paneStore.setActivePane('home')
      }
    }
  }
}
