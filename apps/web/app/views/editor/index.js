import { Editor, Raw } from 'slate'
import AutoReplace from 'slate-auto-replace'
import { Counter, Header, Link, Quote } from './plugins'
import { startsWith, includes } from 'lodash'
import { throttle } from 'lodash-decorators'
import Menu from './menu'
import { view, observable, Component } from '~/helpers'

export { Raw } from 'slate'

const replaceShortcut = (char, type) =>
  AutoReplace({
    trigger: 'space',
    before: char, // /^(>)$/,
    transform: (transform, e, data, matches) => {
      return transform.setBlock({ type, data: {} })
    },
  })

const plugins = [
  replaceShortcut(/^(>)$/, 'quote'),
  replaceShortcut(/^(#)$/, 'header'),
  replaceShortcut(/^(##)$/, 'header2'),
  replaceShortcut(/^(\$counter)$/, 'counter'),
]

@view({
  store: class EditorStore {
    doc = null

    @observable menuLoc = null

    @throttle(200)
    update = val => {
      this.doc.content = Raw.serialize(val)
      this.doc.updated_at = new Date().toISOString()
      this.doc.save()
    }
  },
})
export default class DocEditor extends Component {
  static defaultProps = {
    onChange: _ => _,
  }

  state = {
    val: Raw.deserialize(this.props.doc.content, { terse: true }),
    menu: null,
    focused: false,
  }

  schema = {
    nodes: {
      link: Link,
      counter: Counter,
      header: Header(26),
      header2: Header(20),
      paragraph: props => <p>{props.children}</p>,
      quote: Quote,
    },
    marks: {
      bold: props => <strong>{props.children}</strong>,
      code: props => (
        <code style={{ display: 'inline' }}>{props.children}</code>
      ),
      italic: props => <em style={{ display: 'inline' }}>{props.children}</em>,
      underlined: props => (
        <u style={{ display: 'inline' }}>{props.children}</u>
      ),
    },
  }

  componentWillMount() {
    this.props.store.doc = this.props.doc

    window._activeEditor = {
      destroy: key => {
        const state = this.state.val.transform().removeNodeByKey(key).apply()
        this.onChange(state)
      },

      save: (key, data) => {
        const { store, onChange } = this.props
        const state = this.state.val
          .transform()
          .setNodeByKey(key, { data })
          .apply()

        store.update(state)
        if (onChange) onChange(state)
      },
    }
  }

  @throttle(200)
  onDocumentChange = (doc, state) => {
    const { store, onChange } = this.props
    store.update(state)
    if (onChange) onChange(state)
  }

  componentWillReceiveProps = ({ doc }) => {
    if (this.state.focused) return

    const val = Raw.deserialize(doc.content, { terse: true })
    this.setState({ val })
  }

  onChange = val => {
    this.setState({ val })
  }

  newParagraph = state =>
    state.transform().splitBlock().setBlock('paragraph').apply()

  onEnter = (e, state) => {
    const { startBlock } = state

    const enterNewPara = ['header', 'quote']

    if (enterNewPara.filter(x => startsWith(startBlock.type, x)).length > 0) {
      e.preventDefault()
      return this.newParagraph(state)
    }
  }

  onKeyDown = (e, data, state) => {
    if (e.which === 13) {
      return this.onEnter(e, state)
    }

    // bold/italic/underline
    const buttons = {
      66: 'bold',
      73: 'italic',
      85: 'underlined',
    }

    if (!e.metaKey || !includes(Object.keys(buttons), '' + e.which)) return

    event.preventDefault()

    this.onChange(
      this.state.val.transform().toggleMark(buttons[e.which]).apply()
    )
  }

  addBlock = name => {
    const newState = this.state.val.transform().insertBlock(name).apply()

    this.onChange(newState)
  }

  wrapLink = () => {
    const href = window.prompt('Enter the URL of the link:')

    this.onChange(
      this.state.val
        .transform()
        .wrapInline({
          type: 'link',
          data: { href },
        })
        .collapseToEnd()
        .apply()
    )
  }

  onOpen = portal => {
    this.setState({ menu: portal.firstChild })
  }

  componentDidUpdate() {
    console.log('updated')
    this.updateMenu()
  }

  updateMenu = () => {
    const { menu, val } = this.state

    if (!menu) return
    menu.style.opacity = 0

    if (val.isBlurred || val.isCollapsed) {
      menu.removeAttribute('style')
      return
    }
    menu.style.display = 'flex'

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
    menu.style.position = `absolute`
  }

  onClickMark = (e, type) => {
    e.preventDefault()
    const { val } = this.state

    const next = val.transform().toggleMark(type).apply()

    this.setState({ val: next })
  }

  render({ doc, store, onChange, inline, ...props }) {
    return (
      <root>
        <content>
          <Menu
            if={false}
            onUpdate={this.updateMenu}
            onMark={this.onClickMark}
            onOpen={this.onOpen}
          />
          <Editor
            $editor
            state={this.state.val}
            plugins={plugins}
            key={1}
            schema={this.schema}
            onKeyDown={this.onKeyDown}
            onDocumentChange={this.onDocumentChange}
            onChange={this.onChange}
            onFocus={() => this.setState({ focused: true })}
            onBlur={() => this.setState({ focused: false })}
            {...props}
          />
        </content>
      </root>
    )
  }

  static style = {
    root: {
      flex: 1,
    },
    bar: {
      flexFlow: 'row',
    },
    a: {
      padding: 5,
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
      content: {
        flex: 1,
        overflow: 'hidden',
        overflowY: 'scroll',
      },
    },
  }
}
