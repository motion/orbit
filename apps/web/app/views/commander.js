import React from 'react'
import { view, Shortcuts } from '~/helpers'
import Portal from 'react-portal'
import { Icon } from '~/ui'
import { SIDEBAR_WIDTH } from '~/constants'
import DocView from '~/views/document'

@view.attach('commanderStore')
@view
export default class Commander {
  static defaultProps = {
    onSubmit: _ => _,
  }

  render({ commanderStore: store, onChange, onClose, ...props }) {
    return (
      <Shortcuts name="all" handler={store.onShortcut}>
        <bar $$align="center" $$row $$flex>
          <Icon name="ui-zoom" size={12} color={[0, 0, 0, 0.15]} />
          <input
            {...props}
            if={!store.open}
            value={store.text}
            onChange={e => store.setText(e.target.value)}
            onKeyDown={store.onKeyDown}
            onFocus={store.setFocused}
            onBlur={store.setBlurred}
            ref={el => (store.textbox = el)}
          />
          <Portal
            closeOnEsc
            isOpened={store.open}
            onClose={() => {
              store.open = false
              if (onClose) {
                onClose()
              }
            }}
          >
            <container>
              <overlay />
              <commander>
                <overlaySearch $$row>
                  <Icon name="ui-zoom" size={12} color={[0, 0, 0, 0.15]} />
                  <input
                    $q
                    value={store.text}
                    onChange={e => store.setText(e.target.value)}
                  />
                </overlaySearch>
                <results>
                  <matches>
                    {store.matches.map((doc, index) => (
                      <match
                        onClick={() => store.navTo(doc)}
                        key={index}
                        onMouseEnter={() => {
                          store.highlightIndex = index
                        }}
                        $highlight={index === store.highlightIndex}
                      >
                        {doc.getTitle()}
                      </match>
                    ))}
                  </matches>
                  <preview key={store.highlightIndex} if={store.activeDoc}>
                    <DocView id={store.activeDoc._id} />
                  </preview>
                </results>
              </commander>
            </container>
          </Portal>
        </bar>
      </Shortcuts>
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
      top: 30,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      // right: SIDEBAR_WIDTH,
      // left: 0,
      // bottom: 80,
    },
    overlaySearch: {
      marginLeft: 260,
    },
    q: {
      fontSize: 20,
      border: '1px solid black',
      width: 250,
    },
    center: {
      justifyContent: 'center',
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
      fontSize: 24,
      fontWeight: 500,
      padding: 20,
      border: '1px solid #eee',
      cursor: 'pointer',
      marginBottom: 10,
      background: `rgba(255, 255, 255, 0.7)`,
    },
    matches: {
      padding: 10,
      flex: 1,
      overflow: 'hidden',
      overflowY: 'scroll',
      width: 300,
      textSelect: 'none',
    },
  }
}
