import React from 'react'
import { view } from '@jot/black'
import DocView from '~/views/document'

@view.attach('commanderStore')
@view
export default class CommanderResults {
  render({ commanderStore: store }) {
    const docs = store.docs || []
    return (
      <results>
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
        <noMatches if={docs.length === 0}>
          No docs
        </noMatches>
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
    noMatches: {
      flex: 1,
      fontSize: 24,
      color: '#444',
      justifyContent: 'center',
      alignItems: 'center',
    },
    results: {
      flexFlow: 'row',
      marginTop: 10,
      flex: 1,
    },
    preview: {
      position: 'relative',
      flex: 4,
      maxWidth: 700,
    },
    highlight: {
      borderRadius: 5,
    },
    match: {
      fontSize: 18,
      fontWeight: 500,
      padding: 20,
      border: '1px solid #eee',
      cursor: 'pointer',
      height: 100,
      width: '100%',
      marginBottom: 10,
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
