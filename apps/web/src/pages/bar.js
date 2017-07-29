// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import { User } from '~/app'
import * as UI from '@mcro/ui'

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

@view.attach('rootStore')
@view({
  store: BarStore,
})
export default class BarPage {
  render({ rootStore, store }) {
    return (
      <UI.Theme name="gray">
        <bar>
          <div>
            <UI.Input size={3} borderRadius={5} onChange={store.onChange} />
          </div>
          <results>
            <UI.List
              if={store.children}
              itemProps={{ size: 3 }}
              items={store.children}
              getItem={result =>
                <item key={result.id}>
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
      background: 'rgba(255, 255, 255, 0.75)',
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
