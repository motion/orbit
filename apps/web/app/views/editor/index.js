import { Selection, Editor, Raw } from 'slate'
import { object } from 'prop-types'
import { Document } from '@jot/models'
import { view } from '~/helpers'
import { flatten } from 'lodash'
import * as Nodes from './nodes'
import * as Plugins from './plugins'
import * as Rules from './rules'
import Marks from './marks'
import SelectionStore from './stores/selection'

export { Raw } from 'slate'

const merge = x => flatten(Object.keys(x).map(n => x[n]))
const rules = merge(Rules)

class EditorStore {
  doc = Document.get(this.props.id)
  shouldFocus = this.props.focusOnMount
  focused = false
  content = null
  inline = this.props.inline
  editor = null

  start() {
    this.watch(this.watchers.save)
    this.watch(this.watchers.setContent)
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

  get shouldSave() {
    if (this.hasUploadingImages) {
      return false
    }
    return true
  }

  watchers = {
    setContent: () => {
      if (!this.content && this.doc) {
        this.content = Raw.deserialize(this.doc.content, { terse: true })
      }
    },
    save: () => {
      if (this.doc && this.content && this.shouldSave) {
        this.doc.content = Raw.serialize(this.content)
        this.doc.title = this.content.startBlock.text
        this.doc.save()
      }
    },
  }

  setContent = val => {
    if (!val.equals(this.content)) {
      this.content = val
    }
  }

  focus = () => {
    this.focused = true
  }

  blur = () => {
    this.focused = false
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

  getChildContext() {
    return { editor: this.props.store }
  }

  plugins = Plugins

  schema = {
    rules,
    nodes: Nodes,
    marks: Marks,
  }

  onChange = value => {
    this.props.store.setContent(value)
    this.props.onChange(value)
  }

  getRef = Editor => {
    const { getRef, store } = this.props
    if (Editor) {
      store.editor = Editor
      window.Editor = Editor
      if (getRef) {
        getRef(Editor)
      }
      if (store.shouldFocus) {
        console.log('focusing', this.props.doc)
        Editor.focus()
        store.shouldFocus = false
      }
    }
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
        onMouseUp={(event: MouseEvent) => {
          event.persist()
          SelectionStore.mouseUpEvent = event
        }}
      >
        <Editor
          $editor
          $$undraggable
          readOnly={readOnly}
          plugins={merge(this.plugins)}
          schema={this.schema}
          state={store.content}
          onChange={this.onChange}
          ref={this.getRef}
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
    },
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
