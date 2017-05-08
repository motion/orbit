import { $, view } from '~/helpers'
import { Place, Document } from 'models'
import Portal from 'react-portal'
import { computed } from 'mobx'
import { includes } from 'lodash'
import Mousetrap from 'mousetrap'
import { Modal } from '~/views'

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
  render({ store, store: { docs } }) {
    const { onClose } = this.props

    return (
      <bar>
        <input
          value={store.text}
          onChange={e => {
            store.setText(e.target.value)
          }}
          onFocus={() => {
            store.open = true
          }}
          onKeyDown={store.onKeyDown}
          ref={el => store.textbox = el}
        />
        <Portal
          closeOnEsc
          isOpened={store.open}
          onClose={() => {
            store.open = false
          }}
        >
          <commander>
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
          </commander>
        </Portal>
      </bar>
    )
  }

  static style = {
    commander: {
      padding: 10,
      position: 'absolute',
      background: 'white',
      top: 50,
      right: 0,
      left: 0,
      bottom: 0,
    },
    highlight: {
      background: `#2c88e4`,
      color: 'white',
      borderRadius: 5,
    },
    match: {
      fontSize: 16,
      fontWeight: 600,
      padding: 5,
      marginTop: 5,
      paddingLeft: 10,
    },
    matches: {
      height: 140,
      marginTop: 10,
      overflowY: 'scroll',
    },
    input: {
      padding: 3,
      fontSize: 16,
    },
  }
}
