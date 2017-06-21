// @flow
import { Document } from '@jot/models'
import Router from '~/router'

const OPEN = 'commander_is_open'
const bool = s => s === 'true'

export default class CommanderStore {
  isOpen = true //bool(localStorage.getItem(OPEN)) || false
  value = ''
  path = ''
  highlightIndex = 0
  docs = []
  searchResults = []

  start() {
    this.watch(async () => {
      this.searchResults = await this.getChildDocsForPath(this.value)
    })
  }

  getPath = (path: string): Array<string> => {
    return path.split('/')
  }

  onChange = (event: Event) => {
    this.value = event.target.value
  }

  onEnter = async () => {
    this.path = this.value
    const found = await this.createDocAtPath(this.path)
    console.log('found', found)
    Router.go(found.url())
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
    for (const slug of path.split('/')) {
      const query = { slug }
      if (last) {
        query.parentId = last._id
      }
      last =
        (await Document.collection.findOne(query).exec()) ||
        (create &&
          (await Document.create({
            parentId: last._id,
            title: slug,
            slug,
          })))
      if (!last) {
        return result
      }
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

  actions = {
    up: () => this.moveHighlight(-1),
    down: () => this.moveHighlight(1),
    esc: () => this.onClose(),
    enter: this.onEnter,
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
