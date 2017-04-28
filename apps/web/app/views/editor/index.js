import { Selection, Editor, Raw } from 'slate'
import { Document } from 'models'
import { view, observable, Component, autorun } from '~/helpers'
import { flatten, startsWith, includes } from 'lodash'
import { throttle } from 'lodash-decorators'
import * as Nodes from './nodes'
import * as Plugins from './plugins'
import * as Rules from './rules'
import Marks from './marks'

export { Raw } from 'slate'

const merge = x => flatten(Object.keys(x).map(n => x[n]))
const plugins = merge(Plugins)
const rules = merge(Rules)

class EditorStore {
  _doc = Document.get(this.props.id)
  focused = false
  @observable.ref content = null
  version = 0

  constructor() {
    autorun(this.save)
  }

  get doc() {
    return this._doc && this._doc.current
  }

  get val() {
    if (!this.doc) {
      return null
    }
    if (this.content) {
      return this.content
    }
    return Raw.deserialize(this.doc.content, { terse: true })
  }

  update = val => {
    this.content = val
  }

  save = () => {
    if (this.content) {
      console.log('saving')
      // this.doc.content = Raw.serialize(this.content)
      // this.doc.save()
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
  }

  schema = {
    rules,
    nodes: Nodes,
    marks: Marks,
  }

  onDocumentChange = (doc, state) => {
    this.props.store.update(state)
  }

  render({ id, store, inline, getRef, ...props }) {
    console.log(store.val && store.val.isBlurred)
    return (
      <document if={store.val}>
        <Editor
          $editor
          state={store.val}
          plugins={plugins}
          schema={this.schema}
          onKeyDown={this.onKeyDown}
          onDocumentChange={this.onDocumentChange}
          onFocus={store.focus}
          onBlur={store.blur}
          ref={getRef}
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
