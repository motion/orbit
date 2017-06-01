import React from 'react'
import { view, Shortcuts } from '~/helpers'
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
    return (
      <bar if={false} $$align="center" $$row $$flex>
        {searchIcon}
        <input
          if={!store.isOpen}
          value={store.text}
          onChange={e => store.setText(e.target.value)}
          onFocus={store.onOpen}
        />
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
                    value={store.text}
                    onChange={e => store.setText(e.target.value)}
                    onKeyDown={store.onKeyDown}
                    ref={el => el && el.focus()}
                  />
                </overlaySearch>
                <results>
                  <matches>
                    {store.matches.map((doc, index) => (
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
                    ))}
                  </matches>
                  <preview
                    key={store.text + store.highlightIndex}
                    if={store.activeDoc}
                  >
                    <DocView id={store.activeDoc._id} />
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
      zIndex: 100,
      backdropFilter: 'blur(5px)',
    },
    commander: {
      position: 'absolute',
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
      marginLeft: 213,
      alignItems: 'center',
      height: 30,
    },
    q: {
      width: 300,
      fontSize: 16,
    },
    results: {
      flexFlow: 'row',
    },
    preview: {
      padding: 10,
      flex: 4,
    },
    input: {
      width: '100%',
      background: '#fff',
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
      flex: 1,
      width: '100%',
      marginBottom: 10,
      background: `rgba(255, 255, 255, 0.7)`,
    },
    matches: {
      padding: 10,
      flex: 1,
      width: 285,
      overflow: 'hidden',
      overflowY: 'scroll',
      textSelect: 'none',
    },
  }
}
