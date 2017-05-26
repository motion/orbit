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
  state = null
  slate = null
  plugins = Plugins
  schema = {
    rules,
    marks: Marks,
    nodes: Nodes,
  }

  getRef = ref => {
    this.slate = ref
  }

  setState = (nextState, serialize = false) => {
    console.log('setSate', nextState, serialize)
    if (!serialize) {
      this.state = nextState
    } else {
      this.state = Raw.deserialize(nextState, { terse: true })
    }
  }

  start() {
    if (this.props.onEditor) {
      this.props.onEditor(this)
    }
    if (this.props.state) {
      this.setState(this.props.state, true)
    }
  }

  focus() {
    this.slate.focus()
  }

  blur() {
    this.slate.blur()
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
