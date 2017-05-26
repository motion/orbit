// @flow
import React from 'react'
import { view } from '~/helpers'
import { Button, Icon } from '~/ui'
import Editor from '~/views/editor'
import Router from '~/router'
import Portal from 'react-portal'

@view({
  store: class {
    afterOpen = false

    save = () => {
      const { doc, onClose } = this.props
      doc.draft = false
      doc.save()
      onClose()
    }

    close = () => {
      this.afterOpen = false
      this.props.onClose()
    }
  },
})
export default class Drawer {
  render({ isOpen, doc, store, onClose }) {
    return (
      <drawer $isOpen={isOpen}>
        <Portal
          closeOnEsc
          closeOnOutsideClick
          isOpen={isOpen}
          isOpened={isOpen}
          onOpen={() => {
            requestAnimationFrame(() => {
              store.afterOpen = true
            })
          }}
          onClose={store.close}
        >
          <content $isContentOpen={store.afterOpen}>
            <inner if={isOpen}>
              <editor>
                <Editor inline={false} id={doc._id} doc={doc} />
              </editor>
              <submit>
                <Button onClick={store.save} icon="simple-add">
                  create document
                </Button>
              </submit>
            </inner>
          </content>
        </Portal>
      </drawer>
    )
  }

  static style = {
    drawer: {
      zIndex: 10,
      position: 'absolute',
      pointerEvents: 'none',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      transition: 'backdrop-filter 300ms cubic-bezier(0.165, 0.840, 0.440, 1.000)',
      transform: 'translate3d(0, 0, 0)',
    },
    inner: {
      height: '100%',
    },
    editor: {
      flex: 10,
    },
    isOpen: {
      pointerEvents: 'all',
      backdropFilter: 'blur(8px)',
    },
    submit: {
      width: 200,
    },
    content: {
      margin: 50,
      zIndex: 1000,
      background: 'rgba(255,255,255,0.7)',
      borderRadius: 4,
      border: '1px solid #ccc',
      padding: 40,
      width: 800,
      left: 200,
      right: 200,
      top: 50,
      position: 'absolute',
      // transition: 'transform 100ms ease-in',
      transform: 'translateY(150%) scale(0.8)',
      boxShadow: '2px 4px 11px rgba(0,0,0,0.1)',
      bottom: 50,
    },
    isContentOpen: {
      transform: 'translateY(0%) scale(1)',
    },
  }
}
