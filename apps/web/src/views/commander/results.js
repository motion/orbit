import React from 'react'
import { view } from '@mcro/black'
import DocView from '~/views/document'
import { HEADER_HEIGHT } from '~/constants'
import { last } from 'lodash'
import * as UI from '@mcro/ui'

@view.attach('commanderStore', 'layoutStore')
@view
export default class CommanderResults {
  render({ commanderStore: cmdr }) {
    const docs = cmdr.peek || []

    const getMatch = (doc, index) =>
      <match
        $highlight={index === cmdr.highlightIndex}
        onClick={() => cmdr.navTo(doc)}
        key={doc._id}
        onMouseEnter={() => {
          cmdr.highlightIndex = index
        }}
      >
        <UI.Title size={2.5}>
          {doc.getTitle()}
        </UI.Title>
        <DocView if={false} readOnly document={doc} />
      </match>

    return (
      <results if={cmdr.isOpen}>
        <UI.Placeholder
          if={cmdr.isEnterToCreate && last(cmdr.typedPath).length > 0}
        >
          <UI.Title size={3}>
            {cmdr.typedPath[cmdr.typedPath.length - 2]}
          </UI.Title>
          <UI.Title size={2}>
            ↵ to create {last(cmdr.typedPath)}
          </UI.Title>
        </UI.Placeholder>
        <matches if={docs.length > 0}>
          <UI.Title
            color="rgba(191, 93, 88, 1)"
            $title
            if={!cmdr.isTypingPath}
            size={3}
          >
            {cmdr.value === ''
              ? 'All Docs'
              : `Searching for "${last(cmdr.typedPath)}"`}
          </UI.Title>
          {docs.map(getMatch)}
        </matches>
        <preview
          if={cmdr.highlightedDocument}
          key={cmdr.highlightedDocument._id}
        >
          <DocView
            readOnly
            inline
            id={cmdr.highlightedDocument._id}
            editorProps={{ find: cmdr.value }}
          />
        </preview>
      </results>
    )
  }

  static style = {
    results: {
      zIndex: 10000,
      background: [255, 255, 255, 0.9],
      position: 'absolute',
      top: HEADER_HEIGHT,
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
      marginTop: 10,
      maxWidth: 200,
      color: 'white',
      transition: 'all 100ms ease-in',
      borderLeft: '3px solid rgba(191, 93, 88, 0)',
    },
    preview: {
      position: 'absolute',
      bottom: 20,
      padding: 20,
      height: 300,
      width: 250,
      background: '#fff',
      right: 20,
      borderRadius: '4px',
      border: '1px solid #eee',
      boxShadow: '1px 3px 3px rgba(255,255,255,0.3)',
    },
    highlight: {
      paddingLeft: 10,
      borderLeftColor: 'rgba(191, 93, 88, 1)',
    },
  }
}
