import React from 'react'
import { view } from '@mcro/black'
import DocView from '~/views/document'
import { last } from 'lodash'
import * as UI from '@mcro/ui'

@view.attach('explorerStore', 'layoutStore')
@view
export default class ExplorerResults {
  render({ explorerStore }) {
    const docs = explorerStore.peek || []

    const getMatch = (doc, index) =>
      <match
        $highlight={index === explorerStore.highlightIndex}
        onClick={() => explorerStore.navTo(doc)}
        key={doc._id}
        onMouseEnter={() => {
          explorerStore.highlightIndex = index
        }}
      >
        <UI.Title size={2.5}>
          {doc.getTitle()}
        </UI.Title>
        <DocView if={false} readOnly document={doc} />
      </match>

    return (
      <results $show={explorerStore.showResults}>
        <UI.Placeholder
          if={
            explorerStore.isEnterToCreate &&
            last(explorerStore.typedPath).length > 0
          }
        >
          <UI.Title size={3}>
            {explorerStore.typedPath[explorerStore.typedPath.length - 2]}
          </UI.Title>
          <UI.Title size={2}>
            ↵ to create {last(explorerStore.typedPath)}
          </UI.Title>
        </UI.Placeholder>
        <matches if={docs.length > 0}>
          <UI.Title
            color="rgba(191, 93, 88, 1)"
            $title
            if={!explorerStore.isTypingPath}
            size={3}
          >
            {explorerStore.value === ''
              ? 'All Docs'
              : `Searching for "${last(explorerStore.typedPath)}"`}
          </UI.Title>
          {docs.map(getMatch)}
        </matches>
        <preview
          if={explorerStore.highlightedDocument}
          key={explorerStore.highlightedDocument._id}
        >
          <DocView
            readOnly
            inline
            id={explorerStore.highlightedDocument._id}
            editorProps={{ find: explorerStore.value }}
          />
        </preview>
      </results>
    )
  }

  static style = {
    results: {
      zIndex: 10000,
      background: '#fff',
      // boxShadow: [[0, -5, 8, [0, 0, 0, 0.05]]],
      height: 80,
      position: 'relative',
      transition: 'all ease-in 800ms',
      // position: 'absolute',
      // top: 'calc(-100% + 14px)',
      // left: 0,
      // right: 0,
    },
    show: {
      height: 'auto',
    },
    matches: {
      padding: 15,
      overflow: 'scroll',
      flex: 1,
      minHeight: 100,
      overflowY: 'scroll',
      textSelect: 'none',
    },
    match: {
      padding: [3, 10],
      marginLeft: -15,
      maxWidth: 200,
      color: 'white',
      borderLeft: [3, 'transparent'],
    },
    preview: {
      position: 'absolute',
      bottom: 20,
      padding: 20,
      height: '100%',
      maxHeight: 'calc(100% - 35px)',
      overflow: 'hidden',
      width: 250,
      background: '#fff',
      right: 20,
      borderRadius: '4px',
      border: '1px solid #eee',
    },
    highlight: {
      borderColor: [191, 93, 88, 1],
    },
  }
}
