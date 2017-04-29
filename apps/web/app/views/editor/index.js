import { Selection, Editor, Raw } from 'slate'
import { Document } from 'models'
import { view } from '~/helpers'
import { flatten } from 'lodash'
import * as Nodes from './nodes'
import * as Plugins from './plugins'
import * as Rules from './rules'
import Marks from './marks'

export { Raw } from 'slate'

const merge = x => flatten(Object.keys(x).map(n => x[n]))
const plugins = merge(Plugins)
const rules = merge(Rules)

class EditorStore {
  doc = Document.get(this.props.id)
  focused = false
  content = null

  @view.watch setContent = () => {
    if (!this.content && this.doc) {
      this.content = Raw.deserialize(this.doc.content, { terse: true })
    }
  }

  @view.watch save = () => {
    if (this.content) {
      this.doc.content = Raw.serialize(this.content)
      this.doc.save()
    }
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
  }

  schema = {
    rules,
    nodes: Nodes,
    marks: Marks,
  }

  onChange = value => {
    this.props.store.update(value)
    this.props.onChange(value)
  }

  render({ id, store, onChange, inline, getRef, ...props }) {
    window.store = store
    return (
      <document if={store.content}>
        <Editor
          $editor
          plugins={plugins}
          schema={this.schema}
          state={store.content}
          onChange={this.onChange}
          ref={getRef}
          onFocus={store.focus}
          onBlur={store.blur}
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
