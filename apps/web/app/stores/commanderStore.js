// @flow
import { watch } from '@jot/black'
import { Document } from '@jot/models'
import Router from '~/router'
import { keycode } from '~/helpers'
import { ShortcutManager } from 'react-shortcuts'
import App from '~/app'

const KEYMAP = {
  all: {
    left: 'left',
    right: 'right',
    up: 'up',
    j: 'j', // down
    k: 'k', // up
    d: 'd', // doc
    down: 'down',
    enter: 'enter',
    esc: 'esc',
    commander: 'command+t',
    cmdEnter: 'command+enter',
    delete: ['delete', 'backspace'],
    toggleSidebar: 'command+/',
  },
}

const OPEN = 'commander_is_open'
const bool = s => s === 'true'

export default class CommanderStore {
  keyManager = new ShortcutManager(KEYMAP)
  currentDocument = watch(() => Document.get(Router.params.id))
  crumbs = watch(() => this.currentDocument && this.currentDocument.getCrumbs())
  isOpen = true //bool(localStorage.getItem(OPEN)) || false
  value = ''
  path = ''
  highlightIndex = 0
  searchResults: Array<Document> = []
  input: ?React$Element = null

  start() {
    this.watch(async () => {
      const searchPath = this.currentPathPrefix

      // global! we havent typed any "/" yet
      if (searchPath === this.value) {
        this.searchResults = await Document.collection
          .find()
          .where('slug')
          .regex(new RegExp(`^${this.value}`, 'i'))
          .exec()
      } else {
        this.searchResults = await this.getChildDocsForPath(searchPath)
      }
    })
  }

  actions = {
    esc: () => this.close(),
    enter: () => this.onEnter(),
    commander: () => {
      this.input && this.input.focus()
      this.open()
    },
    down: () => {
      if (!this.searchResults || !this.isOpen) {
        this.actions.focusEditor()
        return
      }
      this.moveHighlight(1)
    },
    up: () => this.moveHighlight(-1),
    focusEditor: () => {
      App.editor.focus()
    },
  }

  handleShortcuts = (action: string, event: KeyboardEvent) => {
    if (!action) return
    this.emit('action', { action, event })
    console.log('action', action, this.actions[action])
    if (this.actions[action]) {
      this.actions[action](event)
    }
  }

  get peek(): Array<Document> {
    if (!this.currentPathSuffix) {
      return this.searchResults
    }
    return this.searchResults.filter(
      doc => doc.slug.indexOf(this.currentPathSuffix) === 0
    )
  }

  get currentPath(): Array<string> {
    return this.getPath(this.value)
  }

  get currentPathPrefix(): string {
    const all = this.getPath(this.value)
    if (all.length === 1) {
      return this.value
    }
    return all.slice(0, all.length - 1).join('/')
  }

  get currentPathSuffix(): ?string {
    const paths = this.getPath(this.value)
    return paths.length > 1 ? paths[paths.length - 1] : null
  }

  get highlightedDocument() {
    return this.peek[this.highlightIndex]
  }

  getPath = (path: string): Array<string> => {
    return path.split('/')
  }

  onChange = (event: Event) => {
    this.value = event.target.value
  }

  createDocAtPath = async (path: string): Document => {
    return await this.getDocAtPath(path, true)
  }

  createDocsAtPath = async (path: string): Array<Document> => {
    return await this.getDocsAtPath(path, true)
  }

  getDocAtPath = async (path: string, create = false): ?Document => {
    const pathLength = this.getPath(path).length
    const docs = await this.getDocsAtPath(path, create)
    return docs[pathLength - 1] || null
  }

  getDocsAtPath = async (path: string, create = false): Array<Document> => {
    const result = []
    let last
    for (const slug of this.getPath(path)) {
      const query = { slug }
      if (last) {
        query.parentId = last._id
      }
      let next = await Document.collection.findOne(query).exec()
      if (!next && create) {
        next = await Document.create({ ...query, title: slug })
      }
      if (!next) {
        return result
      }
      last = next
      result.push(last)
    }
    return result
  }

  getChildDocsForPath = async (path: string): Array<Document> => {
    const lastDoc = await this.getDocAtPath(path)
    if (!lastDoc) {
      return []
    }
    return await this.getChildDocs(lastDoc)
  }

  getChildDocs = async (document: Document): Array<Document> => {
    return await Document.collection.find({ parentId: document._id }).exec()
  }

  onEnter = async () => {
    this.path = this.value
    const found = await this.createDocAtPath(this.path)
    this.navTo(found)
  }

  onKeyDown = (event: KeyboardEvent) => {
    event.persist()
    const code = keycode(event)
    console.log('commander', code)
  }

  open = () => {
    this.setOpen(true)
  }

  close = () => {
    this.setOpen(false)
  }

  setOpen = val => {
    localStorage.setItem(OPEN, val)
    this.isOpen = val
  }

  moveHighlight = (diff: number) => {
    this.highlightIndex += diff
    if (this.highlightIndex === -1)
      this.highlightIndex = this.searchResults.length - 1
    if (this.highlightIndex >= this.searchResults.length)
      this.highlightIndex = 0
  }

  navTo = doc => {
    this.close()
    Router.go(doc.url())
  }
}
