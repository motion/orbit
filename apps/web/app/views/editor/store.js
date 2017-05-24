import { Raw } from 'slate'
import { Place, Document } from '@jot/models'
import * as Nodes from './nodes'
import * as Plugins from './plugins'
import * as Rules from './rules'
import Marks from './marks'
import { includes } from 'lodash'
import { flatten } from 'lodash'

export const merge = x => flatten(Object.keys(x).map(n => x[n]))
const rules = merge(Rules)

export default class EditorStore {
  id = this.props.id || Math.random()
  doc = Document.get(this.props.id)
  // todo replace with doc when we use mention (which is currently turned off)
  allDocs = []
  docSuggestions = []
  lastClick = null
  state = null
  lastSavedRev = null
  shouldFocus = this.props.focusOnMount
  pendingSave = false
  focused = false
  content = null
  inline = this.props.inline || false
  editor = null
  plugins = Plugins
  schema = {
    rules,
    nodes: Nodes,
    marks: Marks,
  }

  start() {
    if (!this.props.inline) {
      this.on(this.props.commanderStore, 'key', name => {
        if (name === 'down') {
          this.editor.focus()
        }
      })
    }

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

  onChange = state => {
    this.state = state
  }

  updateSuggestions = text => {
    this.suggestionsText = text
    this.docSuggestions = this.allDocs
      .filter(doc => includes(doc.title, this.suggestionsText))
      .map(doc => {
        return doc.title
      })
  }

  save = () => {
    this.doc.content = Raw.serialize(this.content)
    this.doc.title = this.content.document.nodes.first().text
    console.log('saving...', this.doc._id, this.doc._rev, this.doc.title)
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

  focus = () => {
    this.focused = true
  }

  blur = () => {
    this.focused = false
  }

  getRef = ref => {
    const { getRef, store } = this.props
    if (ref) {
      this.editor = ref
      if (getRef) {
        getRef(ref)
      }
      if (this.shouldFocus) {
        ref.focus()
        this.shouldFocus = false
      }
    }
  }

  handleDocumentClick = (event: Event) => {
    // if its the child
    if (event.target.parentElement === event.currentTarget) {
      event.preventDefault()
      const { state } = this
      if (!state) {
        return
      }

      const { document } = state

      this.editor.focus()
      const lastNode = document.nodes.last()

      this.editor.setState(
        state
          .transform()
          .collapseToEndOf(lastNode)
          .moveOffsetsTo(lastNode.length)
          .apply()
      )
    }
  }
}
