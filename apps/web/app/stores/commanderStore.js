// @flow
import { Document } from '@jot/models'
import { debounce } from 'lodash'
import Router from '~/router'

const OPEN = 'commander_is_open'
const bool = s => s === 'true'

export default class CommanderStore {
  isOpen = true //bool(localStorage.getItem(OPEN)) || false
  path = ''
  highlightIndex = 0
  docs = []

  start() {
    console.log('starting')
    this.watch(async () => {
      console.log('search', this.path)
      this.docs = await Document.search(this.path)
      console.log('got', this.docs)
    })
  }

  setPath = (path: string) => {
    console.log('setting', path)
    this.path = path
  }

  actions = {
    up: () => this.moveHighlight(-1),
    down: () => this.moveHighlight(1),
    esc: () => this.onClose(),
    enter: () => this.navTo(this.activeDoc),
  }

  onShortcut = (action: string, event: KeyboardEvent) => {
    console.log('on shortcut')
    if (this.actions[action]) {
      console.log('COMMANDER', action, this.actions[action])
      this.actions[action]()
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    // todo
  }

  setOpen = val => {
    localStorage.setItem(OPEN, val)
    this.isOpen = val
  }

  moveHighlight = diff => {
    this.highlightIndex += diff
    if (this.highlightIndex === -1) this.highlightIndex = this.docs.length - 1
    if (this.highlightIndex >= this.docs.length) this.highlightIndex = 0
  }

  navTo = doc => {
    console.log('navto', doc)
    // this.onClose()
    // Router.go(doc.url())
  }
}
