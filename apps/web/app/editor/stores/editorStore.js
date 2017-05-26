// @flow
import { Raw } from 'slate'
import * as Nodes from '../nodes'
import * as Plugins from '../plugins'
import * as Rules from '../rules'
import Marks from '../marks'
import SelectionStore from './selectionStore'
import { flatten, includes } from 'lodash'

export const merge = x => flatten(Object.keys(x).map(n => x[n]))
const rules = merge(Rules)

export default class EditorStore {
  props: {
    onEditor?: Function,
    inline?: boolean,
    id?: string,
  }

  id = this.props.id || `${Math.random()}`
  inline = this.props.inline || false
  selection = new SelectionStore()
  contentState = null
  state = null
  slate = null
  plugins = Plugins
  focused = false
  schema = {
    rules,
    marks: Marks,
    nodes: Nodes,
  }

  start() {
    if (this.props.onEditor) {
      this.props.onEditor(this)
    }
    if (this.props.newState) {
      this.setContents(this.props.newState, true)
    }
    if (this.props.getRef) {
      this.props.getRef(this)
    }
  }

  // this triggers on non-content changes, like selection changes
  // necessary to keep state up to date for transforms
  // sync right back into <Editor state={} />
  onChange = nextState => {
    this.state = nextState
  }

  // contents are only for persisting things
  setContents = (nextState, serialize = false) => {
    if (!serialize) {
      this.state = nextState
    } else {
      this.state = Raw.deserialize(nextState, { terse: true })
    }
    this.contentState = this.state
  }

  // helper for easy transform
  //  this.editorStore.tranform(t => t.wrap(...))
  transform = (callback: Function) => {
    return this.slate.onChange(
      callback(this.slate.getState().transform()).apply()
    )
  }

  getRef = ref => {
    this.slate = ref
  }

  focus() {
    this.slate.focus()
  }

  blur() {
    this.slate.blur()
  }

  onFocus = () => {
    this.focused = true
  }

  onBlur = () => {
    this.focused = false
  }

  get pluginsList() {
    return merge(this.plugins)
  }

  get theme() {
    return this.inline ? { title: { fontSize: 16 } } : {}
  }

  get nodes() {
    return this.state && this.state.document && this.state.document.nodes
  }

  get hasUploadingImages() {
    return (
      this.nodes &&
      this.nodes.some(x => x.type === 'image' && x.data.get('file'))
    )
  }

  handleDocumentClick = (event: MouseEvent) => {
    // if its the child
    if (event.target.parentNode === event.currentTarget) {
      event.preventDefault()
      if (!this.state) {
        return
      }

      this.focus()
      const lastNode = this.state.document.nodes.last()

      this.slate.onChange(
        this.slate
          .getState()
          .transform()
          .collapseToEndOf(lastNode)
          .moveOffsetsTo(lastNode.length)
          .apply()
      )
    }
  }
}
