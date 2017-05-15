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

export { Raw } from 'slate'

const merge = x => flatten(Object.keys(x).map(n => x[n]))
const rules = merge(Rules)

class EditorStore {
  doc = Document.get(this.props.id)

  // todo replace with doc titles
  allDocs = [
    { title: 'one' },
    { title: 'two' },
    { title: 'three' },
    { title: 'four' },
  ]

  docSuggestions = []

  updateSuggestions = text => {
    this.suggestionsText = text
    this.docSuggestions = this.allDocs
      .filter(doc => includes(doc.title, this.suggestionsText))
      .map(doc => {
        return doc.title
      })
  }

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

  // this will prevent save while uploading images...
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
        const secondBlock = this.content.blocks.get(1)
        if (secondBlock) {
          // todo save hashtags
          // this.doc.hashtags = this.content.startBlock
        }
        this.doc.save()
      }
    },
  }

  setContent = val => {
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
      <document if={store.content}>
        <container $inline={inline}>
          <Editor
            $editor
            $$undraggable
            readOnly={readOnly}
            plugins={merge(this.plugins)}
            suggestions={store.docSuggestions}
            onMentionSearch={store.updateSuggestions}
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
        </container>
      </document>
    )
  }

  static style = {
    document: {
      flex: 1,
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
