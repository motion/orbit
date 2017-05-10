import { $, view } from '~/helpers'
import { Place, Document } from 'models'
import Portal from 'react-portal'
import { computed } from 'mobx'
import { includes } from 'lodash'
import Mousetrap from 'mousetrap'
import { Modal } from '~/views'
import { SIDEBAR_WIDTH } from '~/constants'

@view({
  store: class {
    open = false
    docs = Document.recent()
    textbox = null
    text = ''
    highlightIndex = 0

    @computed get matches() {
      return (this.docs || []).filter(doc => {
        return includes(doc.getTitle().toLowerCase(), this.text.toLowerCase())
      })
    }

    start() {
      window._toggleCommander = () => {
        this.open = !this.open
        if (this.open) this.textbox.focus()
      }

      Mousetrap.bind('command+t', _toggleCommander)
      Mousetrap.bind('up', () => {
        if (this.open) this.moveHighlight(-1)
      })
      Mousetrap.bind('down', () => {
        if (this.open) this.moveHighlight(1)
      })

      Mousetrap.bind('enter', () => {
        if (this.open) this.navTo(this.matches[this.highlightIndex])
      })
    }

    moveHighlight = diff => {
      this.highlightIndex += diff

      if (this.highlightIndex === -1) this.highlightIndex = this.docs.length - 1
      if (this.highlightIndex >= this.docs.length) this.highlightIndex = 0
    }

    navTo = doc => {
      this.close()
      doc.routeTo()
    }

    close = () => {
      this.textbox.blur()
      this.open = false
      this.setText('')
    }

    onKeyDown = ({ which }) => {
      if (which === 40) this.moveHighlight(1)
      if (which === 38) this.moveHighlight(-1)
      if (which === 27) this.close()

      if (which === 13) {
        this.navTo(this.matches[this.highlightIndex])
      }
    }

    setText = value => {
      this.text = value
      this.highlightIndex = 0
    }
  },
})
export default class Commander {
  render({ store, store: { docs }, ...props }) {
    const { onClose } = this.props

    return (
      <bar $$flex>
        <input
          {...props}
          value={store.text}
          placeholder="Search documents and people.."
          onChange={e => {
            store.setText(e.target.value)
          }}
          onKeyDown={e => {
            if (store.textbox.value.indexOf('/') === 0) {
              store.open = true
            }
          }}
          onKeyDown={store.onKeyDown}
          ref={el => (store.textbox = el)}
        />
        <Portal
          closeOnEsc
          isOpened={store.open}
          onClose={() => {
            store.open = false
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
      width: '100%',
      background: '#fff',
      border: [1, '#eee'],
      padding: [6, 10],
      fontSize: 16,
      opacity: 0.4,
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
