// @flow
import { Raw } from 'slate'
import SelectionStore from './selectionStore'
import { flatten, includes, uniq } from 'lodash'
import { computed, StoreType } from '@jot/black'
import { getSpec } from './helpers'

type Plugin = Class<Object>

type Props = {
  onEditor?: Function,
  inline?: boolean,
  id?: string,
  getRef?: Function,
}

export default class EditorStore implements StoreType {
  props: Props

  id = this.props.id || `${Math.random()}`
  inline = this.props.inline || false
  selection = new SelectionStore()
  contentState = null
  state = null
  slate = null
  rules = null
  plugins: Array<Plugin> = []
  focused = false
  find = this.props.find
  onlyNode = this.props.onlyNode

  start({ onEditor, getRef, rules, plugins }: Props) {
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
        // TODO: for realtime sync
        console.log('new state, save it')
        // this.setContents(this.props.newState, true)
      }
    })
  }

  // gather and instantiate
  setup(plugins: Array<Plugin>) {
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
  @computed
  get spec(): Object {
    return getSpec(this.plugins, this.rules)
  }

  @computed
  get allPlugins(): Object {
    return this.plugins.reduce(
      (acc, plugin) => ({
        ...acc,
        [plugin.name]: plugin,
      }),
      {}
    )
  }

  get serializedState(): Object {
    return Raw.serialize(this.state)
  }

  get serializedText(): string {
    if (!this.nodes) return ''
    return this.nodes
      .filter(i => includes(['paragraph', 'title'], i.type))
      .map(i => i.nodes.map(n => n.text).join(' '))
      .join('\n')
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

  // HELPERS

  focus = () => {
    this.slate.focus()
  }

  blur = () => {
    this.slate.blur()
  }

  pluginsByCategory = category =>
    this.plugins.filter(plugin => plugin.category === category)

  helpers = {
    toggleMark: mark => this.transform(t => t.toggleMark(mark)),
    toggleBlock: mark => this.transform(t => t.setBlock(mark)),

    collectButtons: (category, type) =>
      flatten(
        this.pluginsByCategory(category)
          .map(plugin => plugin[type])
          .filter(x => !!x)
      ),

    currentBlockIs: type => {
      this.selection.lastNode
      return this.state.blocks.some(block => block.type === type)
    },

    contextButtonsFor: category =>
      this.helpers.collectButtons(category, 'contextButtons'),

    barButtonsFor: category =>
      this.helpers.collectButtons(category, 'barButtons'),
  }

  get pluginCategories() {
    return uniq(this.plugins.map(plugin => plugin.category).filter(x => !!x))
  }

  get theme() {
    return this.inline ? { title: { fontSize: 16 } } : {}
  }

  get nodes(): ?Array<any> {
    return this.state && this.state.document && this.state.document.nodes
      ? this.state.document.nodes
      : null
  }

  get hasUploadingImages(): boolean {
    return (
      !!this.nodes &&
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
