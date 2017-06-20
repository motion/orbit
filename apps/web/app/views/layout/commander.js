import React from 'react'
import { view } from '@jot/black'
import { Shortcuts } from '~/helpers'
import { Portal } from '~/ui'
import DocView from '~/views/document'

const Input = props =>
  <input
    style={{
      gloss: true,
      border: 'none',
      cursor: 'text',
      margin: ['auto', 0],
      padding: [8, 10],
      fontSize: 16,
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
      '&:focus': {
        opacity: 1,
      },
    }}
    {...props}
  />

const SearchIcon = () =>
  <slash
    style={{
      gloss: true,
      fontSize: 22,
      fontWeight: 900,
    }}
  >
    /
  </slash>

@view.attach('commanderStore')
class CommanderResults {
  render({ commanderStore: store }) {
    const docs = store.docs || []
    return (
      <Portal closeOnEsc isOpened={store.isOpen} onClose={store.onClose}>
        <Shortcuts name="all" handler={store.handleShortcuts}>
          <container>
            <overlay />
            <commander>
              <overlaySearch $$row>
                <overlayIcon>
                  <SearchIcon />
                </overlayIcon>
                <Input
                  value={store.textboxText}
                  onChange={e => store.setText(e.target.value)}
                  onKeyDown={store.onKeyDown}
                  ref={el => el && el.focus()}
                />
              </overlaySearch>
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
            </commander>
          </container>
        </Shortcuts>
      </Portal>
    )
  }

  static style = {
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      background: 'rgba(255, 255, 255, .6)',
      backdropFilter: 'blur(15px)',
    },
    noMatches: {
      flex: 1,
      fontSize: 24,
      color: '#444',
      justifyContent: 'center',
      alignItems: 'center',
    },
    commander: {
      position: 'absolute',
      overflow: 'scroll',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10001,
    },
    overlayIcon: {
      marginTop: 3,
    },
    overlaySearch: {
      marginTop: 3,
      marginLeft: 79,
      alignItems: 'center',
      height: 30,
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

@view.attach('commanderStore')
class CommanderInput {
  render({ commanderStore }) {
    return (
      <bar $$align="center" $$row>
        <SearchIcon />
        <Input if={!commanderStore.isOpen} onFocus={commanderStore.onOpen} />
      </bar>
    )
  }

  static style = {
    query: {
      flex: 1,
      fontSize: 16,
    },
  }
}

export default {
  Results: CommanderResults,
  Input: CommanderInput,
}
