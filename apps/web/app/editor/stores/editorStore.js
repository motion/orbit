// @flow
import { Raw } from 'slate'
import SelectionStore from './selectionStore'
import { flatten, includes, uniq } from 'lodash'
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
      contextButtons: [],
      barButtons: [],
    }

    // add to slate spec
    for (const plugin of this.plugins) {
      const {
        rules,
        plugins,
        marks,
        nodes,
        contextButtons,
        barButtons,
      } = plugin

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
      if (contextButtons) {
        response.contextButtons = [
          ...response.contextButtons,
          ...contextButtons,
        ]
      }
      if (barButtons) {
        response.barButtons = [...response.barButtons, ...barButtons]
      }
    }

    return response
  }

  @computed get allPlugins() {
    return Object.keys(this.plugins).reduce(
      (acc, key) => ({
        ...acc,
        [this.plugins[key].name]: this.plugins[key],
      }),
      {}
    )
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

  // TRANSFORM HELPERS

  // for easy transform
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

  toggleMark = mark => () => this.transform(t => t.toggleMark(mark))
  toggleBlock = mark => () => this.transform(t => t.setBlock(mark))

  // HELPERS

  focus = () => {
    this.slate.focus()
  }

  blur = () => {
    this.slate.blur()
  }

  pluginsByCategory = category =>
    this.plugins.filter(plugin => plugin.category === category)

  collectFromPlugin = (category, thing) =>
    flatten(
      this.pluginsByCategory(category)
        .map(plugin => plugin[thing])
        .filter(x => !!x)
    )

  helpers = {
    currentBlockIs: type => {
      this.selection.lastNode
      this.state
      return this.state.blocks.some(block => block.type === type)
    },

    contextButtonsFor: category =>
      this.collectFromPlugin(category, 'contextButtons'),

    barButtonsFor: category => this.collectFromPlugin(category, 'barButtons'),
  }

  get pluginCategories() {
    return uniq(this.plugins.map(plugin => plugin.category).filter(x => !!x))
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

  // PRIVATE

  onFocus = () => {
    this.focused = true
  }

  onBlur = () => {
    this.focused = false
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

  getRef = ref => {
    this.slate = ref
  }
}
