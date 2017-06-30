import React from 'react'
import { view } from '@mcro/black'
import DocView from '~/views/document'
import { HEADER_HEIGHT } from '~/constants'
import { last } from 'lodash'
import moment from 'moment'

@view.attach('commanderStore')
@view.attach('layoutStore')
@view
export default class CommanderResults {
  render({ commanderStore: store }) {
    const docs = store.peek || []

    setTimeout(() => {
      this.props.layoutStore.isCommanderOpen = store.isOpen
    })

    const getMatch = (doc, index) =>
      <match
        $highlight={index === store.highlightIndex}
        onClick={() => store.navTo(doc)}
        key={doc._id}
        onMouseEnter={() => {
          store.highlightIndex = index
        }}
      >
        <UI.Title size={2.5}>
          {doc.getTitle()}
        </UI.Title>
        <DocView if={false} readOnly document={doc} />
      </match>

    return (
      <results transparent if={store.isOpen}>
        <UI.Placeholder
          tag="div"
          if={store.isEnterToCreate && last(store.typedPath).length > 0}
        >
          <UI.Title
            rootProps={{ style: { justifyContent: 'center' } }}
            size={3}
          >
            {store.typedPath[store.typedPath.length - 2]}
          </UI.Title>
          <UI.Title size={2}>
            ↵ to create {last(store.typedPath)}
          </UI.Title>
        </UI.Placeholder>
        <matches if={docs.length > 0}>
          <UI.Title
            color="rgba(191, 93, 88, 1)"
            $title
            transparent
            if={!store.isTypingPath}
            size={3}
          >
            {store.value === ''
              ? 'All Docs'
              : `Searching for "${last(store.typedPath)}"`}
          </UI.Title>
          {docs.map((doc, index) => getMatch(doc, index))}
        </matches>
        <preview
          if={store.highlightedDocument}
          key={store.highlightedDocument._id}
        >
          <DocView
            readOnly
            inline
            id={store.highlightedDocument._id}
            editorProps={{ find: store.value }}
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
    create: {
      flex: 1,
      color: 'rgba(255,255,255,.9)',
      fontSize: 24,
      textAlign: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
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
      marginTop: 15,
      maxWidth: 200,
      color: 'white',
      transition: 'all 100ms ease-in',
      borderLeft: `3px solid rgba(191, 93, 88, 0)`,
    },
    name: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    info: {
      fontSize: 14,
      opacity: 0.7,
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
      borderLeftColor: `rgba(191, 93, 88, 1)`,
    },
  }
}
