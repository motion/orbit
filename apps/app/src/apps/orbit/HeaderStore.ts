import * as React from 'react'
import { react } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'

export class HeaderStore {
  inputRef = React.createRef()
  iconHovered = false

  get highlightWords() {
    if (!this.props.appStore.nlpStore.marks) {
      return null
    }
    return () => this.props.appStore.nlpStore.marks
  }

  onInput = () => {
    this.props.orbitStore.onChangeQuery(this.inputRef.innerText)
  }

  focus = () => {
    if (!this.inputRef || !this.inputRef.current) {
      return
    }
    this.inputRef.current.focus()
  }

  focusInput = react(
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
        this.props.orbitStore.clearQuery()
      } else {
        this.props.paneStore.setActivePane('home')
      }
    }
  }
}
