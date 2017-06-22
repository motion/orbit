import React from 'react'
import { view } from '@jot/black'
import DocView from '~/views/document'

@view.attach('commanderStore')
@view
export default class CommanderResults {
  render({ commanderStore: store }) {
    const docs = store.peek || []

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
        <preview
          if={store.highlightedDocument}
          key={store.highlightedDocument._id}
        >
          <DocView
            readOnly
            id={store.highlightedDocument._id}
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
    matches: {
      padding: 10,
      overflow: 'scroll',
      flex: 1,
      minHeight: 100,
      overflowY: 'scroll',
      textSelect: 'none',
    },
    match: {
      padding: [4, 5],
      borderRadius: 4,
      fontSize: 16,
    },
    preview: {
      width: 300,
      height: 400,
      border: [1, '#ccc'],
    },
    highlight: {
      background: '#eee',
    },
  }
}
