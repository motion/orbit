import { createUsableStore, react } from '@o/kit'
import { ActiveDraggables } from '@o/ui'

import { appsDrawerStore } from '../../om/stores'

type DockOpenState = 'open' | 'closed' | 'pinned'

export class OrbitDockStore {
  state: DockOpenState = 'closed'

  nextState: {
    state: DockOpenState
    delay: number
  } | null = null

  hoveredIndex = -1

  nextHovered: {
    index: number
    at: number
  } | null = null

  get isOpen() {
    if (appsDrawerStore.isOpen) {
      return true
    }
    return this.state !== 'closed'
  }

  setState(next: DockOpenState = 'open') {
    if (next === this.state) return
    this.state = next
    this.nextState = null
  }

  deferUpdateState = react(
    () => this.nextState,
    async (nextState, { sleep }) => {
      if (nextState) {
        await sleep(nextState.delay)
        this.state = nextState.state
        this.nextState = null
      }
    },
  )

  close = () => {
    this.setState('closed')
    this.nextHovered = null
    // hide hover immediately on force close
    this.hoveredIndex = -1
    if (appsDrawerStore.isOpen) {
      appsDrawerStore.close()
    }
  }

  hoverLeave = () => {
    if (this.state !== 'pinned') {
      this.nextState = {
        state: 'closed',
        delay: 500,
      }
    }
  }

  hoverEnter = () => {
    if (this.state !== 'pinned') {
      this.nextState = {
        state: 'open',
        delay: 0,
      }
    }
  }

  hoverEnterButton = (index: number = this.hoveredIndex) => {
    if (this.nextHovered && this.nextHovered.index === index) return
    this.nextHovered = { index, at: Date.now() }
  }

  hoverLeaveButton = () => {
    if (this.nextHovered && this.nextHovered.index === -1) return
    this.nextHovered = { index: -1, at: Date.now() }
  }

  addCancelableDragOnMenuOpen = react(
    () => this.hoveredIndex,
    index => {
      if (index > -1) {
        ActiveDraggables.add(this.hoverEnterButton)
      } else {
        ActiveDraggables.remove(this.hoverEnterButton)
      }
    },
  )

  clearHoverOnDrawerOpen = react(
    () => appsDrawerStore.isOpen,
    () => {
      this.hoveredIndex = -1
    },
  )

  deferUpdateHoveringButton = react(
    () => this.nextHovered,
    async (next, { sleep }) => {
      if (!next) return
      if (this.hoveredIndex === -1 || next.index === -1) {
        await sleep(next.index > -1 ? 100 : 200)
      }
      this.hoveredIndex = next.index
      await sleep(100)
      if (next.index > -1) {
        this.hoverEnter()
      } else {
        this.hoverLeave()
      }
    },
    {
      lazy: true,
    },
  )

  onClickDockOpen = () => {
    if (appsDrawerStore.isOpen) {
      this.close()
      return
    }
    switch (this.state) {
      case 'pinned':
        this.setState('closed')
        return
      case 'closed':
        this.setState('pinned')
        return
      case 'open':
        this.setState('pinned')
        return
    }
  }
}

export const orbitDockStore = createUsableStore(OrbitDockStore)
window['orbitDockStore'] = orbitDockStore
