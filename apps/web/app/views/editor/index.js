import { Selection, Editor, Raw } from 'slate'
import { object } from 'prop-types'
import { Document } from 'models'
import { view } from '~/helpers'
import { flatten } from 'lodash'
import * as Nodes from './nodes'
import * as Plugins from './plugins'
import * as Rules from './rules'
import Marks from './marks'

export { Raw } from 'slate'

const merge = x => flatten(Object.keys(x).map(n => x[n]))
const rules = merge(Rules)

class EditorStore {
  doc = Document.get(this.props.id)
  shouldFocus = this.props.focusOnMount
  focused = false
  content = null

  start() {
    this.watch(this.watchers.save)
    this.watch(this.watchers.setContent)
  }

  // this will prevent save while uploading images...
  get shouldSave() {
    if (
      this.content &&
      this.content.nodes &&
      this.content.nodes.some(x => x.type === 'inline-image')
    ) {
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
        const secondBlock = this.content.blocks.get(1)
        if (secondBlock) {
          // todo save hashtags
          // this.doc.hashtags = this.content.startBlock
        }
        this.doc.save()
      }
    },
  }

  update = val => {
    this.content = val
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
    this.props.store.update(value)
    this.props.onChange(value)
  }

  getRef = node => {
    const { getRef, store } = this.props
    if (node) {
      if (getRef) {
        getRef(node)
      }
      if (store.shouldFocus) {
        node.focus()
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
    // todo use context
    window.Editor = this
    if (doc) window.Editor.doc = doc

    return (
      <document if={store.content}>
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
