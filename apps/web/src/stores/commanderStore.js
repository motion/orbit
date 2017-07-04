// @flow
import { watch, log, keycode, ShortcutManager } from '@mcro/black'
import { Document } from '@mcro/models'
import Router from '~/router'
import { uniq } from 'lodash'
import { Plain } from 'slate'
import App from '~/app'
import { Observable } from 'rxjs'

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

export default class CommanderStore {
  v = 11
  mouseMoving = Observable.fromEvent(window, 'mousemove')
    .throttleTime(500)
    .map(event => {
      return Date.now() - 500 > this.mouseMoving.current || 0
    })
    .reduce((acc, x) => acc && x && Date.now())

  keyManager = new ShortcutManager(KEYMAP)
  currentDocument = watch(() => Document.get(Router.params.id))
  crumbs = watch(() => this.currentDocument && this.currentDocument.getCrumbs())
  isOpen = false
  value = ''
  editorState = Plain.deserialize(
    'This is editable plain text, just like a <textarea>!'
  )
  path = ''
  highlightIndex = -1
  searchResults: Array<Document> = []
  input: ?HTMLInputElement = null
  renderIndex = 0
  focused = false
  active = false
  PATH_SEPARATOR = PATH_SEPARATOR

  start() {
    this.watch(async () => {
      if (!this.isTypingPath) {
        // search
        const [searchResults, pathSearchResults] = await Promise.all([
          Document.search(this.value).exec(),
          Document.collection
            .find()
            .where('slug')
            .regex(new RegExp(`^${this.value}`, 'i'))
            .exec(),
        ])

        this.searchResults = uniq(
          [...(searchResults || []), ...pathSearchResults],
          x => x.id
        )
      } else {
        // path navigate
        this.searchResults = await this.getChildDocsForPath(
          this.typedPathPrefix
        )
      }
    })

    this.watch(() => {
      if (this.crumbs && Array.isArray(this.crumbs)) {
        this.setValue(this.toPath(this.crumbs))
      }
    })

    this.watch(() => {
      if (Router.path === '/') {
        this.setValue('/')
      }
    })
  }

  get isSelected() {
    return false
    return this.input.selectionEnd > this.input.selectionStart
  }

  select = (start, end) => {
    return
    this.input.setSelectionRange(start, end)
  }

  action = (name: string) => {
    // always emit
    this.emit('action', name)
    if (this.actions[name]) {
      console.log('action', name)
      this.actions[name](event)
    }
  }

  actions = {
    toggleSidebar: () => {
      console.log('got')
      App.layoutStore.sidebar.toggle()
    },
    esc: () => {
      if (App.errors.length) {
        App.clearErrors()
      }
      if (this.isSelected) {
        this.select(this.input.selectionEnd, this.input.selectionEnd)
        return
      }
      this.close()
    },
    enter: () => this.onEnter(),
    focus: () => this.focus(),
    commander: () => {
      this.focus()
      this.open()
    },
    right: () => {
      if (!this.focused || !this.searchResults) return
      this.onRight()
    },
    down: () => {
      if (!this.focused) return
      if (!this.searchResults || !this.isOpen) {
        this.action('focusDown')
        return
      }
      this.moveHighlight(1)
    },
    up: () => {
      if (!this.focused) return
      this.moveHighlight(-1)
    },
  }

  focus = () => {
    console.log('focused')
    if (!this.input) {
      console.error('no commander input')
    } else {
      this.input.focus()
      this.input.select()
    }
  }

  handleShortcuts = (action: string, event: KeyboardEvent) => {
    if (!action) return
    this.action(action, event)
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
    return this.isTypingPath && this.peek && this.peek.length === 0
  }

  get currentPath(): string {
    return this.splitPath(this.crumbs)
  }

  get isTypingPath(): boolean {
    return this.value.indexOf('/') > -1
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
    return path.split(PATH_SEPARATOR)
  }

  onChange = state => {
    this.highlightIndex = -1
    this.editorState = state
    this.value = state.document.text
    this.open()
  }

  setValue = text => {
    this.editorState = Plain.deserialize(text)
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

    if (path === '/') {
      return await Document.root().exec()
    }

    for (const slug of this.splitPath(path)) {
      const query = { slug }
      if (last) {
        query.parentId = last._id
      }
      let next = await Document.collection.findOne(query).exec()
      if (!next && create) {
        next = await Document.create({
          ...query,
          title: slug,
          parentIds: result.map(doc => doc._id),
        })
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

  getPathForDocs = (docs: Array<Document>): string =>
    docs.map(doc => doc.getTitle()).join(PATH_SEPARATOR)

  onFocus = () => {
    this.focused = true
    this.renderIndex++
    this.open()
  }

  onBlur = () => {
    this.focused = false
    this.active = false
  }

  onActivate = () => {
    this.active = true
    setTimeout(() => {
      this.focus()
    })
  }

  onEnter = async () => {
    if (!this.focused) {
      return
    }

    // correct attempt to make docs like: doc/is/here (ie: missing the initial /)
    if (this.value.indexOf('/') !== 0 && this.value.indexOf(' ') === -1) {
      this.setValue(`/${this.value}`)
    }
    this.path = this.value

    if (this.highlightIndex > -1) {
      this.navTo(this.highlightedDocument)
    } else {
      const found = await this.createDocAtPath(this.path)
      this.navTo(found)
    }
    this.setTimeout(() => App.editor && App.editor.focus(), 200)
  }

  pathContent = () => {
    console.log('getting content', this.focused)
    if (this.focused) {
      return this.value
    } else {
      return '(unfocused)'
    }
  }

  onKeyDown = (event: KeyboardEvent, data, state) => {
    event.persist()

    const code = keycode(event)

    if (code === 'enter') {
      event.preventDefault()
      this.onEnter()
      return state
    }

    if (code === 'esc') {
      event.preventDefault()
      this.close()
      return state
    }

    return state
  }

  onRight = () => {
    // only matters if you're navigating with arrow keys
    if (this.highlightIndex === -1) return

    const endPath = this.highlightedDocument.title

    if (this.typedPath.length === 1) {
      this.setValue(endPath)
      return
    }

    this.setValue(
      this.typedPath.slice(0, -1).join(PATH_SEPARATOR) +
        PATH_SEPARATOR +
        endPath
    )
  }

  setPath = async doc => {
    this.setValue(this.getPathForDocs(await doc.getCrumbs()))
  }

  open = () => {
    this.setOpen(true)
  }

  close = () => {
    this.renderIndex++
    // this.input.blur()
    this.setOpen(false)
  }

  setOpen = val => {
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
