// @flow
import { Raw } from 'slate'
import SelectionStore from './selectionStore'
import { flatten, includes } from 'lodash'
import { computed } from '~/helpers'

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
  rules = null
  plugins = []
  focused = false

  start({ onEditor, getRef, rules, plugins }) {
    this.rules = rules
    this.setup(plugins)

    if (onEditor) {
      onEditor(this)
    }
    if (getRef) {
      getRef(this)
    }

    this.watch(() => {
      if (this.props.newState) {
        // for realtime sync
        console.log('new state, save it')
        // this.setContents(this.props.newState, true)
      }
    })
  }

  // gather and instantiate
  setup(plugins) {
    this.plugins = []
    for (const Plugin of plugins) {
      try {
        this.plugins.push(new Plugin({ editorStore: this }))
      } catch (e) {
        console.error(e)
        console.warn(
          `Plugin is not a class: ${(Plugin && Plugin.toString()) || Plugin}`
        )
      }
    }
  }

  // return slate-like schema
  @computed get spec() {
    const schema = {
      marks: {},
      nodes: {},
      rules: this.rules,
    }
    const response = {
      schema,
      plugins: [],
      barButtons: [],
      contextButtons: [],
    }

    // add to slate spec
    for (const {
      rules,
      plugins,
      marks,
      nodes,
      barButtons,
      contextButtons,
    } of this.plugins) {
      if (rules) {
        schema.rules = [...schema.rules, ...rules]
      }
      if (plugins) {
        response.plugins = [...response.plugins, ...plugins]
      }
      if (marks) {
        schema.marks = { ...schema.marks, ...marks }
      }
      if (nodes) {
        schema.nodes = { ...schema.nodes, ...nodes }
      }
      if (barButtons) {
        response.barButtons = [...response.barButtons, ...barButtons]
      }
      if (contextButtons) {
        response.contextButtons = [
          ...response.contextButtons,
          ...contextButtons,
        ]
      }
    }

    return response
  }

  get serializedState() {
    return Raw.serialize(this.state)
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
    if (!this.slate) {
      console.log('called transform before slate loaded')
      return
    }
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
