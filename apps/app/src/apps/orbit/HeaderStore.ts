import * as React from 'react'
import { react, sleep } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'
import { SearchStore } from '../../stores/SearchStore'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'

const moveCursorToEndOfTextarea = textarea => {
  textarea.setSelectionRange(textarea.value.length, textarea.value.length)
}

export class HeaderStore {
  props: {
    searchStore: SearchStore
    paneStore: OrbitDockedPaneStore
  }

  inputRef = React.createRef<HTMLDivElement>()
  iconHovered = false

  get highlightWords() {
    if (!this.props.searchStore.nlpStore.marks) {
      return null
    }
    return () => this.props.searchStore.nlpStore.marks
  }

  onInput = () => {
    if (!this.inputRef.current) {
      return
    }
    this.props.searchStore.onChangeQuery(this.inputRef.current.innerText)
  }

  focus = () => {
    if (!this.inputRef.current) {
      return
    }
    moveCursorToEndOfTextarea(this.inputRef.current)
    this.inputRef.current.focus()
  }

  focusInputOnVisible = react(
    () => [
      App.orbitState.pinned || App.orbitState.docked,
      // use this because otherwise input may not focus
      App.isMouseInActiveArea,
    ],
    async ([shown], { when }) => {
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
