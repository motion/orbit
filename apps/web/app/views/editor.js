import { Editor, Raw } from 'slate'
import AutoReplace from 'slate-auto-replace'
import { Component, view } from '~/helpers'
import { Hello, Header, Link, Quote } from './nodes'
import { startsWith } from 'lodash'
import { throttle } from 'lodash-decorators'

export { Raw } from 'slate'

const replaceShortcut = (char, type) =>
  AutoReplace({
    trigger: 'space',
    before: char, // /^(>)$/,
    transform: (transform, e, data, matches) => {
      return transform.setBlock({ type })
    },
  })

const plugins = [
  replaceShortcut(/^(>)$/, 'quote'),
  replaceShortcut(/^(#)$/, 'header'),
  replaceShortcut(/^(##)$/, 'header2'),
]

@view({
  store: class EditorStore {
    doc = null

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
    focused: false,
  }

  schema = {
    nodes: {
      hello: Hello,
      link: Link,
      header: Header(26),
      header2: Header(20),
      paragraph: props => <p>{props.children}</p>,
      quote: Quote,
    },
  }

  componentWillMount() {
    this.props.store.doc = this.props.doc

    window._activeEditor = {
      destroy: key => {
        const state = this.state.val.transform().removeNodeByKey(key).apply()
        this.onChange(state)
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

  render({ doc, onChange, inline, ...props }) {
    return (
      <root>
        <bar if={!inline}>
          <a onClick={() => this.addBlock('hello')}>blck</a>
          <a onClick={() => this.wrapLink()}>link</a>
        </bar>
        <content>
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
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
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
