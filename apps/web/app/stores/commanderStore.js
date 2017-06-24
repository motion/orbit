// @flow
import { watch, store } from '@jot/black'
import { Document } from '@jot/models'
import Router from '~/router'
import { keycode } from '~/helpers'
import { ShortcutManager } from 'react-shortcuts'
import App from '~/app'

const PATH_SEPARATOR = '/'
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
    commander: ['command+t'],
    focus: 'command+l',
    cmdEnter: 'command+enter',
    delete: ['delete', 'backspace'],
    toggleSidebar: 'command+\\',
  },
}

const OPEN = 'commander_is_open'
const bool = s => s === 'true'

export default class CommanderStore {
  keyManager = new ShortcutManager(KEYMAP)
  currentDocument = watch(() => Document.get(Router.params.id))
  crumbs = watch(() => this.currentDocument && this.currentDocument.getCrumbs())
  isOpen = false //bool(localStorage.getItem(OPEN)) || false
  value = ''
  path = ''
  highlightIndex = -1
  searchResults: Array<Document> = []
  input: ?React$Element = null

  start() {
    this.watch(async () => {
      if (!this.isTypingPath) {
        // search
        this.searchResults = await Document.collection
          .find()
          .where('slug')
          .regex(new RegExp(`${this.value}`, 'i'))
          .exec()
      } else {
        // path navigate
        this.searchResults = await this.getChildDocsForPath(
          this.typedPathPrefix
        )
      }
    })

    this.watch(() => {
      if (this.crumbs && Array.isArray(this.crumbs)) {
        this.value = this.toPath(this.crumbs)
      }
    })

    this.watch(() => {
      if (Router.path === '/') {
        this.value = '/'
      }
    })
  }

  actions = {
    toggleSidebar: () => {
      App.layoutStore.sidebar.toggle()
    },
    esc: () => {
      if (App.errors.length) {
        App.clearErrors()
      } else {
        this.close()
      }
    },
    enter: () => this.onEnter(),
    focus: () => this.focus(),
    commander: () => {
      this.focus()
      this.open()
    },
    right: () => {
      this.onRight()
    },
    down: e => {
      e.preventDefault()
      if (!this.searchResults || !this.isOpen) {
        this.actions.focusEditor()
        return
      }
      this.moveHighlight(1)
    },
    up: e => {
      e.preventDefault()
      this.moveHighlight(-1)
    },
    focusEditor: () => {
      App.editor.focus()
    },
  }

  focus = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  handleShortcuts = (action: string, event: KeyboardEvent) => {
    if (!action) return
    this.emit('action', { action, event })
    if (this.actions[action]) {
      console.log('action', action)
      this.actions[action](event)
    }
  }

  get peek(): Array<Document> {
    if (!this.typedPathSuffix) {
      return this.searchResults
    }
    return this.searchResults.filter(
      doc => doc.slug.indexOf(this.typedPathSuffix) === 0
    )
  }

  get isEnterToCreate() {
    return this.isTypingPath && this.peek.length === 0
  }

  get currentPath(): string {
    return this.splitPath(this.crumbs)
  }

  get isTypingPath(): boolean {
    return this.value[0] === '/'
  }

  get typedPath(): Array<string> {
    return this.splitPath(this.value)
  }

  get typedPathPrefix(): string {
    if (!this.isTypingPath) {
      return this.value
    }
    const all = this.splitPath(this.value)
    // if on root path
    if (all.length === 1) {
      return this.value
    }
    // else, return up to current dir
    return all.slice(0, all.length - 1).join(PATH_SEPARATOR)
  }

  get typedPathSuffix(): ?string {
    const path = this.typedPath
    return path.length > 1 ? path[path.length - 1] : null
  }

  get highlightedDocument() {
    if (this.highlightIndex === -1) return null
    return this.peek[this.highlightIndex]
  }

  toPath = (crumbs: Array<Document>): string => {
    return crumbs.map(document => document.slug).join(PATH_SEPARATOR)
  }

  splitPath = (path: string): Array<string> => {
    return path.split(PATH_SEPARATOR).slice(path[0] === '/' ? 1 : 0)
  }

  onChange = (event: Event) => {
    this.highlightIndex = -1
    this.value = event.target.value
    this.open()
  }

  createDocAtPath = async (path: string): Document => {
    return await this.getDocAtPath(path, true)
  }

  createDocsAtPath = async (path: string): Array<Document> => {
    return await this.getDocsAtPath(path, true)
  }

  getDocAtPath = async (path: string, create = false): ?Document => {
    const pathLength = this.splitPath(path).length
    const docs = await this.getDocsAtPath(path, create)
    return docs[pathLength - 1] || null
  }

  getDocsAtPath = async (path: string, create = false): Array<Document> => {
    const result = []
    let last
    console.log('slugs are', this.splitPath(path))

    if (path === '/') {
      console.log('returning root', await Document.root().exec())
      return await Document.root().exec()
    }

    for (const slug of this.splitPath(path)) {
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
    if (path === '/') return await Document.root().exec()
    const lastDoc = await this.getDocAtPath(path)
    if (!lastDoc) {
      return []
    }
    return await this.getChildDocs(lastDoc)
  }

  getChildDocs = async (document: Document): Array<Document> => {
    return await Document.collection.find({ parentId: document._id }).exec()
  }

  onFocus = () => {
    console.log('focused commanderstore')
    this.open()
  }

  onEnter = async () => {
    console.log('highlight index is', this.highlightIndex)
    if (this.highlightIndex > -1) {
      this.navTo(this.highlightedDocument)
    } else {
      this.path = this.value
      const found = await this.createDocAtPath(this.path)
      this.navTo(found)
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    event.persist()
    const code = keycode(event)
    console.log('commander', code)
  }

  onRight = () => {
    // only matters if you're navigating with arrow keys
    if (this.highlightIndex === -1) return

    const endPath =
      PATH_SEPARATOR + this.highlightedDocument.title + PATH_SEPARATOR

    if (this.typedPath.length === 1) {
      this.value = endPath
      return
    }

    this.value =
      PATH_SEPARATOR +
      this.typedPath.slice(0, -1).join(PATH_SEPARATOR) +
      endPath
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
    if (!doc) {
      console.log('navTo called without value')
      return
    }
    this.close()
    Router.go(doc.url())
  }
}
