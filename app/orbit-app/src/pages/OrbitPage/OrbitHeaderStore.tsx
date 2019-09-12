import { Electron } from '@o/stores'
import { createUsableStore, ensure, react, UpdatePriority } from '@o/use-store'
import { createRef } from 'react'

import { sleep } from '../../helpers'
import { queryStore } from '../../om/stores'
import { whenIdle } from './OrbitApp'
import { appsCarouselStore } from './OrbitAppsCarouselStore'

const moveCursorToEndOfTextarea = el => {
  el.setSelectionRange(el.value.length, el.value.length)
}
const selectTextarea = el => {
  el.setSelectionRange(0, el.value.length)
}

class HeaderStore {
  inputRef = createRef<HTMLDivElement>()

  get highlightWords() {
    const { activeMarks } = queryStore.queryFilters
    if (!activeMarks) {
      return
    }
    const markPositions = activeMarks.map(x => [x[0], x[1], x[2]])
    return () => markPositions
  }

  onInput = () => {
    if (!this.inputRef.current) {
      return
    }
    queryStore.setQuery(this.inputRef.current.innerText)
  }

  triggerFocus = 0

  async focus() {
    if (!this.inputRef || !this.inputRef.current) return
    if (document.activeElement === this.inputRef.current) return
    this.triggerFocus = Date.now()
  }

  doFocus = react(
    () => this.triggerFocus,
    async (_, { when }) => {
      await whenIdle()
      await whenIdle()
      await when(() => !appsCarouselStore.isAnimating)
      ensure('this.inputRef.current', !!this.inputRef.current)
      ensure('not already active', document.activeElement !== this.inputRef.current)
      // this causes re-paints, dont do it too eagerly
      this.inputRef.current!.focus()
      moveCursorToEndOfTextarea(this.inputRef.current)
    },
  )

  focusInputOnVisible = react(
    () => Electron.state.showOrbitMain,
    async (shown, { sleep }) => {
      ensure('shown', shown)
      ensure('ref', !!this.inputRef.current)
      // wait for after it shows
      await sleep(40)
      this.focus()
      selectTextarea(this.inputRef.current)
    },
  )

  focusInputOnClearQuery = react(
    () => queryStore.hasQuery,
    query => {
      ensure('no query', !query)
      this.focus()
    },
  )

  handleMouseUp = async () => {
    await sleep(0)
    await whenIdle()
    this.focus()
  }

  paneState = react(
    () => [appsCarouselStore.focusedApp, appsCarouselStore.zoomedIn],
    async ([focusedApp, zoomedIn], { sleep }) => {
      await sleep(20)
      if (appsCarouselStore.isAnimating) {
        await sleep(100)
        await whenIdle()
      }
      return { focusedApp, zoomedIn }
    },
    {
      defaultValue: [appsCarouselStore.focusedApp, appsCarouselStore.zoomedIn],
      priority: UpdatePriority.Idle,
    },
  )
}

export const headerStore = createUsableStore(HeaderStore)
window['headerStore'] = headerStore
export const useHeaderStore = headerStore.useStore
