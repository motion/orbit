import { App } from '@o/stores'
import { ensure, react, useHook } from '@o/use-store'
import { createRef } from 'react'
import { AppActions } from '../actions/appActions/AppActions'
import { sleep } from '../helpers'
import { useStoresSimple } from '../hooks/useStores'

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

export class HeaderStore {
  stores = useHook(useStoresSimple)
  mouseUpAt = 0
  inputRef = createRef<HTMLDivElement>()
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
    if (document.activeElement === this.inputRef.current) {
      return
    }
    this.inputRef.current.focus()
    moveCursorToEndOfTextarea(this.inputRef.current)
  }

  focusInputOnVisible = react(
    () => App.orbitState.docked,
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

  // this function isn't used
  onClickOrb = () => {
    // App.sendMessage(App, App.messages.HIDE)
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

  handleMouseUp = async () => {
    await sleep(10)
    window['requestIdleCallback'](() => {
      this.focus()
    })
  }
}
