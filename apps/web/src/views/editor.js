import { Editor, Raw } from 'slate'
import AutoReplace from 'slate-auto-replace'
import { Component, view, observable } from 'helpers'
import { Hello, Header, Link, Quote } from './nodes'
import { startsWith } from 'lodash'

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

@view
export default class DocEditor extends Component {
  state = {
    val: Raw.deserialize(this.props.content, { terse: true }),
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
    window._activeEditor = {
      destroy: key => {
        const state = this.state.val.transform().removeNodeByKey(key).apply()
        this.onChange(state)
      },
    }
  }

  onChange = val => {
    this.setState({ val })
    if (this.props.onChange) {
      this.props.onChange(val)
    }
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
    const { val } = this.state

    this.onChange(
      val
        .transform()
        .wrapInline({
          type: 'link',
          data: { href },
        })
        .collapseToEnd()
        .apply()
    )
  }

  render({ onRef }) {
    const editorStyle = {
      color: '#4c555a',
      fontSize: 14,
      lineHeight: 1.9,
      fontFamily: 'Whitney SSm A,Whitney SSm B,Helvetica,Arial',
    }

    return (
      <editor>
        <a onClick={() => this.addBlock('hello')}>add hello</a>
        <a onClick={() => this.wrapLink()}>wrap link</a>
        <Editor
          state={this.state.val}
          style={editorStyle}
          plugins={plugins}
          schema={this.schema}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          ref={onRef}
        />
      </editor>
    )
  }
}
