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
  searchResults: Array<Document> = []

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

    this.watch(async () => {
      this.docsAtPrefix = await this.getChildDocs(this.currentPathPrefix)
    })
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
    return this.docs[this.highlightIndex]
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

  actions = {
    up: () => this.moveHighlight(-1),
    down: () => this.moveHighlight(1),
    esc: () => this.close(),
    enter: this.onEnter,
  }

  onShortcut = (action: string, event: KeyboardEvent) => {
    if (this.actions[action]) {
      console.log('COMMANDER', action, this.actions[action])
      this.actions[action]()
    }
  }

  onEnter = async () => {
    this.path = this.value
    const found = await this.createDocAtPath(this.path)
    this.close()
    Router.go(found.url())
  }

  onKeyDown = (event: KeyboardEvent) => {
    console.log(event.which)
    if (event.which === 13) {
      this.onEnter()
    }
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

  moveHighlight = diff => {
    this.highlightIndex += diff
    if (this.highlightIndex === -1) this.highlightIndex = this.docs.length - 1
    if (this.highlightIndex >= this.docs.length) this.highlightIndex = 0
  }

  navTo = doc => {
    console.log('navto', doc)
    // this.close()
    // Router.go(doc.url())
  }
}
