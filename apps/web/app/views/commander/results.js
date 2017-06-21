import React from 'react'
import { view } from '@jot/black'
import DocView from '~/views/document'

@view.attach('commanderStore')
@view
export default class CommanderResults {
  render({ commanderStore: store }) {
    const docs = store.searchResults || []

    return (
      <results if={store.isOpen && docs.length}>
        <matches if={docs.length > 0}>
          {docs.map((doc, index) =>
            <match
              onClick={() => store.navTo(doc)}
              key={doc._id}
              onMouseEnter={() => {
                store.highlightIndex = index
              }}
              $highlight={index === store.highlightIndex}
            >
              {doc.getTitle()}
            </match>
          )}
        </matches>
        <preview key={store.activeDoc._id} if={store.activeDoc}>
          <DocView
            readOnly
            id={store.activeDoc._id}
            editorProps={{ find: store.text }}
          />
        </preview>
      </results>
    )
  }

  static style = {
    results: {
      zIndex: 10000,
      background: '#fff',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    preview: {
      position: 'relative',
      flex: 4,
      maxWidth: 700,
    },
    highlight: {
      borderRadius: 5,
    },
    matches: {
      overflow: 'scroll',
      paddingLeft: 10,
      paddingRight: 10,
      flex: 1,
      maxWidth: 350,
      overflow: 'hidden',
      overflowY: 'scroll',
      textSelect: 'none',
    },
  }
}
