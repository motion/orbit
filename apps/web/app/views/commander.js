import React from 'react'
import { view, Shortcuts } from '~/helpers'
import Portal from 'react-portal'
import { Icon } from '~/ui'
import { SIDEBAR_WIDTH } from '~/constants'

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
            value={store.text}
            onChange={e => {
              const val = e.target.value
              store.setText(val)
            }}
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
            <commander>
              <div $$flex />
              <matches>
                <div $$flex />
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
            </commander>
          </Portal>
        </bar>
      </Shortcuts>
    )
  }

  static style = {
    commander: {
      position: 'absolute',
      top: '50%',
      right: SIDEBAR_WIDTH,
      left: 0,
      bottom: 80,
    },
    input: {
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
      background: `#eee`,
      borderRadius: 5,
    },
    match: {
      fontSize: 14,
      fontWeight: 500,
      padding: 3,
      paddingLeft: 10,
    },
    matches: {
      padding: 10,
      flex: 1,
      overflow: 'hidden',
      overflowY: 'scroll',
      background: [255, 255, 255, 0.8],
    },
  }
}
