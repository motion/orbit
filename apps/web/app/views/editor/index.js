import React from 'react'
import { Editor } from 'slate'
import { object } from 'prop-types'
import { Document } from '@jot/models'
import { view } from '~/helpers'
import SelectionStore from './stores/selection'
import EditorStore, { merge } from './store'
import Popovers from './popovers'

export { Raw } from 'slate'

@view.attach('commanderStore')
@view({
  store: EditorStore,
})
export default class EditorView {
  static defaultProps = {
    onChange: _ => _,
    getRef: _ => _,
    onKeyDown: _ => _,
  }

  static childContextTypes = {
    editor: object,
  }

  onDocumentChange = (document, state) => {
    this.props.store.setContent(state)
  }

  getChildContext() {
    return { editor: this.props.store }
  }

  render({
    id,
    doc,
    readOnly,
    store,
    onKeyDown,
    onChange,
    inline,
    getRef,
    focusOnMount,
    ...props
  }) {
    return (
      <document
        if={store.content}
        onClick={store.handleDocumentClick}
        onMouseUp={(event: MouseEvent) => {
          event.persist()
          SelectionStore.mouseUpEvent = event
        }}
      >
        <Editor
          $editor
          $$undraggable
          readOnly={readOnly}
          plugins={merge(store.plugins)}
          schema={store.schema}
          state={store.state || store.content}
          onDocumentChange={this.onDocumentChange}
          ref={store.getRef}
          onFocus={store.focus}
          onBlur={store.blur}
          onKeyDown={e => {
            onKeyDown(e)
          }}
          {...props}
        />
        <Popovers editorStore={store} />
      </document>
    )
  }

  static style = {
    document: {
      flex: 1,
      cursor: 'text',
    },
    inline: (() => {
      const scaleBy = 5

      return {
        transform: `scale(${1 / scaleBy})`,
        width: `${scaleBy * 100}%`,
        transformOrigin: `top left`,
        overflow: 'visible',
        transform: 'all 150ms ease-in',
      }
    })(),
    editor: {
      color: '#4c555a',
      fontSize: 16,
      lineHeight: 1.5,
      fontFamily: 'Whitney SSm A,Whitney SSm B,Helvetica,Arial',
    },
  }

  static theme = {
    inline: {
      document: {
        overflow: 'hidden',
      },
    },
  }
}
