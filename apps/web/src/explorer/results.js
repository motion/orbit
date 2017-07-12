import React from 'react'
import { view } from '@mcro/black'
import DocView from '~/views/document'
import { last } from 'lodash'
import * as UI from '@mcro/ui'

@view
class Match {
  render({ doc, store, index }) {
    const highlight = index === store.highlightIndex

    return (
      <match
        $highlight={highlight}
        onClick={() => store.navTo(doc)}
        key={doc._id}
        onMouseEnter={() => {
          store.highlightIndex = index
        }}
      >
        <top $$row>
          <UI.Title size={1.5}>
            {doc.getTitle()}
          </UI.Title>
          <UI.Icon
            $star
            size={14}
            name="fav3"
            color={'#666'}
            if={doc.hasStar()}
          />
        </top>
        <info $$row>
          <text>jp/bugs/zaid</text>
          <text>13 open threads</text>
        </info>
      </match>
    )
  }

  static style = {
    match: {
      padding: [3, 10],
      marginLeft: -15,
      maxWidth: 350,
      marginBottom: 15,
      borderLeft: [3, 'transparent'],
      transition: 'border-left-color 100ms ease-in',
    },
    highlight: {
      borderLeft: [3, [191, 93, 88, 1]],
    },
    top: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    info: {
      justifyContent: 'space-between',
      fontSize: 14,
      fontWeight: 500,
    },
  }
}

@view.attach('explorerStore', 'layoutStore')
@view
export default class ExplorerResults {
  render({ explorerStore: store }) {
    const docs = store.peek || []

    const getMatch = (doc, index) => <Match {...{ store, doc, index }} />

    return (
      <results if={store.showResults}>
        <UI.Placeholder
          if={store.isEnterToCreate && last(store.typedPath).length > 0}
        >
          <UI.Title size={3}>
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
            if={!store.isTypingPath}
            size={1}
          >
            {store.value === ''
              ? 'All Docs'
              : `Searching for "${last(store.typedPath)}"`}
          </UI.Title>
          {docs.map(getMatch)}
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
      background: '#fff',
      // boxShadow: [[0, -5, 8, [0, 0, 0, 0.05]]],
      position: 'relative',
      transition: 'all ease-in 800ms',
      flex: 1,
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
    preview: {
      position: 'absolute',
      bottom: 20,
      padding: [10, 20],
      height: '100%',
      // maxHeight: 'calc(100% - 35px)',
      maxHeight: 300,
      overflow: 'hidden',
      width: 250,
      minHeight: 200,
      background: '#fff',
      right: 20,
      borderRadius: '4px',
      border: '1px solid #eee',
    },
  }
}
