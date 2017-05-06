import { $, view } from '~/helpers'
import Portal from 'react-portal'
import { Place, Document } from 'models'
import { computed } from 'mobx'
import { includes } from 'lodash'
import Mousetrap from 'mousetrap'

@view({
  store: class {
    open = false
    docs = Document.recent()
    text = ''
    highlightIndex = 0

    @computed get matches() {
      return (this.docs || []).filter(doc => {
        return includes(doc.getTitle(), this.text)
      })
    }

    start() {
      Mousetrap.bind('command+t', () => {
        this.open = !this.open
      })
    }

    moveHighlight = diff => {
      this.highlightIndex += diff

      if (this.highlightIndex === -1) this.highlightIndex = this.docs.length - 1
      if (this.highlightIndex >= this.docs.length) this.highlightIndex = 0
    }

    onKeyDown = ({ which }) => {
      if (which === 40) this.moveHighlight(1)
      if (which === 38) this.moveHighlight(-1)

      if (which === 13) {
        const url = this.docs[this.highlightIndex].url()
        Router.go(url)
        this.setText('')
        this.open = false
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
      <Portal
        closeOnEsc
        closeOnOutsideClick
        isOpened={store.open}
        onClose={() => {
          store.open = false
        }}
      >
        <commander>
          <modal>
            <input
              autoFocus
              value={store.text}
              onChange={e => store.setText(e.target.value)}
              onKeyDown={store.onKeyDown}
            />
            <matches>
              {store.matches.map((doc, index) => (
                <match key={index} $highlight={index === store.highlightIndex}>
                  {doc.getTitle()}
                </match>
              ))}
            </matches>
          </modal>
        </commander>
      </Portal>
    )
  }

  static style = {
    commander: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1000000,
      justifyContent: 'center',
      alignItems: 'center',
    },
    highlight: {
      fontWeight: 'bold',
    },
    match: {
      fontSize: 16,
      marginTop: 5,
    },
    matches: {
      height: 140,
      marginTop: 10,
      overflowY: 'scroll',
    },
    input: {
      padding: 10,
      fontSize: 18,
    },
    modal: {
      background: 'white',
      borderRadius: 5,
      padding: 30,
    },
  }
}
