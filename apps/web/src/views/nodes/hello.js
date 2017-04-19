import { Editor, Raw } from 'slate'
import { node, view, observable } from 'helpers'

@node
@view
export default class Hello {
  onClick = () => {
    const { node } = this.props
    this.props.onDestroy()
  }

  render() {
    const { node } = this.props
    console.log('node is', node)

    return (
      <hello>
        <h1>hello! {node.key}</h1>
        <a onClick={this.onClick}>
          delete!
        </a>
      </hello>
    )
  }
}
