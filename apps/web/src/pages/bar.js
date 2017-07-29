// @flow
import React from 'react'
import { view, watch, HotKeys } from '@mcro/black'
import { User } from '~/app'
import * as UI from '@mcro/ui'
import { uniq } from 'lodash'

const PATH_SEPARATOR = '/'

const { ipcRenderer } = window.require('electron')
console.log('ipcRenderer', ipcRenderer)

// import DocumentView from '~/views/document'
// <DocumentView document={document} isPrimaryDocument />

class BarStore {
  searchResults: Array<Document> = []
  highlightIndex = -1
  value = ''
  @watch children = () => this.currentDoc && this.currentDoc.getChildren()

  get results() {
    return this.searchResults.length ? this.searchResults : this.children
  }

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
            .limit(20)
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
  }

  get currentDoc() {
    return User.home
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

  get selectedItem() {
    const inline = this.editorState.focusInline
    if (!inline || inline.type !== 'item') return null
    return inline
  }

  get selectedItemKey() {
    return this.selectedItem && this.selectedItem.key
  }

  get itemNodes() {
    return this.firstLine.nodes.filter(i => i.type === 'item')
  }

  get selectedItemIndex() {
    return this.itemNodes.map(i => i.key).indexOf(this.selectedItemKey)
  }

  get highlightedDocument() {
    if (this.highlightIndex === -1) return null
    return this.peek[this.highlightIndex]
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
      return User.home
    }
    for (const slug of this.splitPath(path)) {
      const query = { slug }
      if (last) {
        query.parentId = last.id
      }
      let next = await Document.collection.findOne(query).exec()
      if (!next && create) {
        next = await Document.create({
          ...query,
          title: slug,
          parentId: last.id,
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
    if (path === '/') {
      return User.home
    }
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
    docs.map(doc => doc.title).join(PATH_SEPARATOR)

  toPath = (crumbs: Array<Document>): string => {
    return crumbs.map(document => document.slug).join(PATH_SEPARATOR)
  }

  splitPath = (path: string): Array<string> => {
    return path.split(PATH_SEPARATOR)
  }

  onEnter = async () => {
    if (this.highlightIndex > -1) {
      this.navTo(this.highlightedDocument)
    } else if (this.selectedItem) {
      this.onItemClick(this.selectedItemKey)
    } else {
      const found = await this.createDocAtPath(this.value)
      this.navTo(found)
    }
    this.setTimeout(() => App.editor && App.editor.focus(), 200)
  }

  onChange = ({ target: { value } }) => {
    this.value = value
  }

  actions = {
    right: () => {
      if (!this.focused || !this.searchResults) return
      this.onRight()
    },
    down: () => {
      if (!this.focused) return
      if (!this.showResults || !this.focused) {
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
}

@view({
  store: BarStore,
})
export default class BarPage {
  onClick = result => {
    console.log('goto22', result.url())
    ipcRenderer.send('goto', result.url())
    console.log('sent')
  }

  render({ store }) {
    console.log('bar render')
    return (
      <HotKeys handlers={store.actions}>
        <UI.Theme name="clear-dark">
          <bar $$draggable>
            <div>
              <UI.Input
                size={3}
                borderRadius={5}
                onChange={store.onChange}
                borderWidth={0}
              />
            </div>
            <results>
              <UI.List
                if={store.results}
                controlled
                isSelected={(item, index) => index === store.highlightIndex}
                onSelect={result => this.onClick(result)}
                itemProps={{ size: 3 }}
                items={store.results}
                getItem={result =>
                  <item key={result.id}>
                    {result.title}
                  </item>}
              />
            </results>
          </bar>
        </UI.Theme>
      </HotKeys>
    )
  }

  static style = {
    bar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: {
        z: 0,
      },
      // background: 'rgba(255, 255, 255, 0.75)',
    },
    results: {
      flex: 2,
    },
    item: {
      fontSize: 42,
      opacity: 0.6,
      padding: [20, 10],
    },
  }
}
