// @flow
import React from 'react'
import { view } from '~/helpers'
import { Button, Icon } from '~/ui'
import Document from '~/views/document'
import Router from '~/router'
import Portal from 'react-portal'

@view({
  store: class {
    afterOpen = false
    blurBg = false

    save = () => {
      const { doc, onClose } = this.props
      doc.draft = false
      doc.save()
      onClose()
    }

    close = () => {
      this.afterOpen = false
      this.blurBg = false
      this.props.onClose()
    }
  },
})
export default class Drawer {
  render({ isOpen, doc, store, onClose }) {
    return (
      <Portal
        closeOnEsc
        closeOnOutsideClick
        isOpen={isOpen}
        isOpened={isOpen}
        onOpen={() => {
          requestAnimationFrame(() => {
            store.afterOpen = true
            setTimeout(() => {
              store.blurBg = true
            }, 120)
          })
        }}
        onClose={store.close}
      >
        <drawer $isOpen={store.blurBg}>
          <content $isContentOpen={store.afterOpen}>
            {/* delay showing slightly for faster animation */}
            <inner if={store.blurBg && isOpen}>
              <editor if={store.blurBg}>
                <Document inline={false} id={doc._id} document={doc} />
              </editor>
              <submit>
                <Button onClick={store.save} icon="simple-add">
                  create document
                </Button>
              </submit>
            </inner>
          </content>
        </drawer>
      </Portal>
    )
  }

  static style = {
    drawer: {
      zIndex: 10000,
      position: 'absolute',
      pointerEvents: 'none',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'backdrop-filter 150ms cubic-bezier(0.165, 0.840, 0.440, 1.000)',
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
      backdropFilter: 'blur(4px)',
    },
    submit: {
      width: 200,
    },
    content: {
      padding: 40,
      flex: 1,
      background: 'rgba(255,255,255,0.7)',
      borderRadius: 4,
      width: '100%',
      height: '100%',
      maxWidth: '80%',
      maxHeight: '80%',
      border: '1px solid #ccc',
      transition: 'transform 100ms ease-in',
      transform: 'scale(0.7) translate3d(0, 55%, 0)',
      boxShadow: '2px 4px 11px rgba(0,0,0,0.1)',
    },
    isContentOpen: {
      transform: 'scale(1) translate3d(0, 0, 0)',
    },
  }
}
