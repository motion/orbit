import React from 'react'
import { view } from '@jot/black'
import { Shortcuts } from '~/helpers'
import { Portal, Icon } from '~/ui'
import { SIDEBAR_WIDTH } from '~/constants'
import DocView from '~/views/document'
import CommanderStore from './store'

@view.attach('keyStore')
@view({
  store: CommanderStore,
})
export default class Commander {
  render({ store }) {
    const searchIcon = <Icon name="ui-zoom" size={12} color={[0, 0, 0, 0.15]} />
    const docs = store.docs || []

    return (
      <bar $$align="center" $$row $$flex>
        {searchIcon}
        <input if={!store.isOpen} onFocus={store.onOpen} />
        <Portal closeOnEsc isOpened={store.isOpen} onClose={store.onClose}>
          <Shortcuts name="all" handler={store.handleShortcuts}>
            <container>
              <overlay />
              <commander>
                <overlaySearch $$row>
                  <overlayIcon>
                    {searchIcon}
                  </overlayIcon>
                  <input
                    $q
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
                    No Matches
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
      </bar>
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
      // background: '#fff',
      // backdropFilter: 'blur(5px)',
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
      top: 50,
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
    q: {
      width: 300,
      fontSize: 16,
    },
    results: {
      flexFlow: 'row',
      marginTop: 10,
      flex: 1,
    },
    preview: {
      position: 'relative',
      flex: 4,
      background: `rgba(255, 255, 255, .8)`,
      border: '1px solid #eee',
      maxWidth: 700,
    },
    input: {
      width: '100%',
      background: '#fff',
      border: 'none',
      cursor: 'text',
      margin: ['auto', 0],
      padding: [8, 10],
      marginTop: -50,
      fontSize: 16,
      opacity: 0.8,
      '&:hover': {
        opacity: 1,
      },
      '&:focus': {
        opacity: 1,
      },
    },
    highlight: {
      background: `rgba(240, 240, 240, 0.9)`,
      border: '1px solid #ccc',
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
      background: `rgba(255, 255, 255, 0.7)`,
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
