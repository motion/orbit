// @flow
import { autorunAsync } from '~/helpers'
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

  start() {
    console.log('starting')
    this.watch(async () => {
      console.log('search', this.path)
      this.docs = await Document.search(this.path)
      console.log('got', this.docs)
    })

    autorunAsync(() => {
      console.log('done typing', this.path)
    }, 1000)
  }

  get pathList(): Array<string> {
    return this.path.split('/')
  }

  onChange = (value: string) => {
    this.value = value
  }

  onEnter = async () => {
    this.path = this.value
    const found = await this.getDocAtPath()
    console.log('found', found)
    Router.go(found.url())
  }

  getDocAtPath = async (): Document => {
    const all = await this.getDocsAtPath()
    return all[all.lenght]
  }

  getDocsAtPath = async (): Array<Document> => {
    const [root, ...rest] = this.pathList
    let currentDoc = await Document.findOrCreate({ slug: root })
    let result = [currentDoc]

    for (const part of rest) {
      const found = await Document.collection
        .findOne({
          slug: part,
          parentId: currentDoc._id,
        })
        .exec()

      currentDoc =
        found ||
        (await Document.create({
          parentId: currentDoc._id,
          title: part,
        }))

      result.push(currentDoc)
    }

    return result
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
