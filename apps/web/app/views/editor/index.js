import React from 'react'
import { Selection, Editor, Raw } from 'slate'
import { object } from 'prop-types'
import { Document } from '@jot/models'
import { view } from '~/helpers'
import { flatten } from 'lodash'
import * as Nodes from './nodes'
import * as Plugins from './plugins'
import * as Rules from './rules'
import Marks from './marks'
import { includes } from 'lodash'
import SelectionStore from './stores/selection'

export { Raw } from 'slate'

const merge = x => flatten(Object.keys(x).map(n => x[n]))
const rules = merge(Rules)

class EditorStore {
  id = this.props.id
  doc = Document.get(this.props.id)

  // todo replace with doc when we use mention (which is currently turned off)
  allDocs = []
  docSuggestions = []

  updateSuggestions = text => {
    this.suggestionsText = text
    this.docSuggestions = this.allDocs
      .filter(doc => includes(doc.title, this.suggestionsText))
      .map(doc => {
        return doc.title
      })
  }

  lastSavedRev = null
  shouldFocus = this.props.focusOnMount
  pendingSave = false
  focused = false
  state = null
  content = null
  inline = this.props.inline
  editor = null
  plugins = Plugins
  schema = {
    rules,
    nodes: Nodes,
    marks: Marks,
  }

  start() {
    // init content
    this.watch(() => {
      if (this.doc && !this.content) {
        this.content = Raw.deserialize(this.doc.content, { terse: true })
      }
    })

    // this forces it to save on doc update
    this.react(
      () => this.doc && this.doc._rev,
      rev => {
        if (this.pendingSave === true) {
          console.log('clear pending', rev)
          this.pendingSave = false
        }
      }
    )

    // save
    this.react(
      () => [this.content, this.pendingSave],
      () => {
        if (this.canSave) {
          this.save()
        }
      }
    )
  }

  save = () => {
    console.log('saving...', this.doc._rev)
    this.doc.content = Raw.serialize(this.content)
    this.doc.title = this.content.startBlock.text
    this.doc.save()
    this.lastSavedRev = this.doc._rev
    this.pendingSave = false
  }

  get theme() {
    return this.inline ? { title: { fontSize: 16 } } : {}
  }

  get nodes() {
    return this.content && this.content.document && this.content.document.nodes
  }

  get hasUploadingImages() {
    return (
      this.nodes &&
      this.nodes.some(x => x.type === 'image' && x.data.get('file'))
    )
  }

  get canSave() {
    if (!this.content) {
      return false
    }
    if (this.lastSavedRev === this.doc._rev) {
      return false
    }
    // for now, prevent saving when not focused
    // avoid tons of saves on inline docs
    if (!this.focused) {
      return false
    }
    if (this.hasUploadingImages) {
      return false
    }
    return true
  }

  setContent = state => {
    this.pendingSave = true
    this.content = state
  }

  setState = state => {
    this.state = state
  }

  focus = () => {
    this.focused = true
  }

  blur = () => {
    this.focused = false
  }

  getRef = Editor => {
    const { getRef, store } = this.props
    if (Editor) {
      this.editor = Editor
      window.Editor = Editor
      if (getRef) {
        getRef(Editor)
      }
      if (this.shouldFocus) {
        console.log('focusing', this.props.doc)
        Editor.focus()
        this.shouldFocus = false
      }
    }
  }

  handleDocumentClick = (event: Event) => {
    // if its the child
    if (event.target.parentElement === event.currentTarget) {
      event.preventDefault()
      const state = this.editor.getState()
      if (!state) {
        return
      }

      const { document } = state

      this.editor.focus()
      const lastNode = document.nodes.last()

      // move to end
      return state
        .transform()
        .collapseToEndOf(lastNode)
        .moveOffsetsTo(lastNode.length)
        .apply()
    }
  }
}

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
          onChange={store.setState}
          ref={store.getRef}
          onFocus={store.focus}
          onBlur={store.blur}
          onKeyDown={e => {
            onKeyDown(e)
          }}
          {...props}
        />
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
