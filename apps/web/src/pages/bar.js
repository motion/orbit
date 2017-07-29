// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
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

  toPath = (crumbs: Array<Document>): string => {
    return crumbs.map(document => document.slug).join(PATH_SEPARATOR)
  }

  splitPath = (path: string): Array<string> => {
    return path.split(PATH_SEPARATOR)
  }

  onChange = ({ target: { value } }) => {
    this.value = value
  }
}

@view({
  store: BarStore,
})
export default class BarPage {
  onClick = result => () => {
    console.log('goto22', result.url())
    ipcRenderer.send('goto', result.url())
    console.log('sent')
  }

  render({ store }) {
    console.log('bar render')
    return (
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
              if={store.children}
              itemProps={{ size: 3 }}
              items={store.children}
              getItem={result =>
                <item key={result.id} onClick={this.onClick(result)}>
                  {result.title}
                </item>}
            />
          </results>
        </bar>
      </UI.Theme>
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
