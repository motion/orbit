// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import { User } from '~/app'
import * as UI from '@mcro/ui'
import { uniq } from 'lodash'
import InboxList from '~/views/inbox/list'
import fuzzy from 'fuzzy'

const { ipcRenderer } = window.require('electron')

// import DocumentView from '~/views/document'
// <DocumentView document={document} isPrimaryDocument />

class BarStore {
  searchResults: Array<Document> = []
  highlightIndex = -1
  value = ''

  get currentDoc() {
    return User.home
  }

  @watch children = () => this.currentDoc && this.currentDoc.getChildren()

  get results() {
    const { children = [], searchResults } = this
    const hayStack = [...children, ...searchResults]
    return fuzzy
      .filter(this.value, hayStack, {
        extract: el => el.title,
        pre: '<',
        post: '>',
      })
      .map(item => item.original)
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

  get highlightedDocument() {
    if (this.highlightIndex === -1) return null
    return this.results[this.highlightIndex]
  }

  moveHighlight = (diff: number) => {
    this.highlightIndex += diff
    if (this.highlightIndex === -1) {
      this.highlightIndex = this.results.length - 1
    }
    if (this.highlightIndex >= this.results.length) {
      this.highlightIndex = 0
    }
    log('hlindex', this.highlightIndex)
  }

  onEnter = async () => {
    if (this.highlightIndex > -1) {
      this.navTo(this.highlightedDocument)
    } else {
      const found = await this.createDocAtPath(this.value)
      this.navTo(found)
    }
  }

  onChange = ({ target: { value } }) => {
    this.value = value
  }

  actions = {
    right: () => {
      console.log('right')
      // this.onRight()
    },
    down: () => {
      this.moveHighlight(1)
    },
    up: () => {
      this.moveHighlight(-1)
    },
    left: () => {
      console.log('left')
    },
    esc: () => {
      console.log('got esc')
      ipcRenderer.send('bar-hide')
    },
    cmdA: () => {
      console.log('cmdA')
      this.inputRef.select()
    },
  }

  onClick = result => {
    if (result) {
      ipcRenderer.send('bar-goto', result.url())
    }
  }
}

@view({
  store: BarStore,
})
export default class BarPage {
  render({ store }) {
    store.highlightIndex // reactive
    log('renderbar')
    return (
      <HotKeys handlers={store.actions}>
        <UI.Theme name="clear-dark">
          <bar $$fullscreen $$draggable>
            <div>
              <UI.Input
                size={3}
                getRef={store.ref('inputRef').set}
                borderRadius={5}
                onChange={store.onChange}
                borderWidth={0}
                css={{
                  padding: [0, 10],
                }}
              />
            </div>
            <results>
              <section
                $list
                css={{
                  width: '50%',
                }}
              >
                <UI.List
                  if={store.results}
                  controlled
                  isSelected={(item, index) => index === store.highlightIndex}
                  onSelect={store.onClick}
                  itemProps={{ size: 2.5 }}
                  items={store.results}
                  getItem={result =>
                    <UI.List.Item key={result.id} padding={0}>
                      <item>
                        {result.title}
                      </item>
                    </UI.List.Item>}
                />
              </section>

              <preview
                css={{
                  width: '50%',
                  height: '100%',
                  borderLeft: [1, [0, 0, 0, 0.1]],
                }}
              >
                <InboxList filter={store.value} />
              </preview>
            </results>
          </bar>
        </UI.Theme>
      </HotKeys>
    )
  }

  static style = {
    bar: {
      // background: [0, 0, 0, 0.1],
      flex: 1,
      transform: {
        z: 0,
      },
      // background: 'rgba(255, 255, 255, 0.75)',
    },
    results: {
      flex: 2,
      flexFlow: 'row',
    },
    item: {
      fontSize: 38,
      opacity: 0.6,
      padding: [18, 10],
    },
  }
}
