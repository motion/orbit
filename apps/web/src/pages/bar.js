// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import { User } from '~/app'
import * as UI from '@mcro/ui'
const { ipcRenderer } = window.require('electron')
console.log('ipcRenderer', ipcRenderer)

// import DocumentView from '~/views/document'
// <DocumentView document={document} isPrimaryDocument />

class BarStore {
  filter = ''

  get currentDoc() {
    return User.home
  }

  @watch children = () => this.currentDoc && this.currentDoc.getChildren()

  onChange = ({ target: { value } }) => {
    this.filter = value
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
        <bar>
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
