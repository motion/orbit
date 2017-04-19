import { Editor, Raw } from 'slate'
import { node, view, observable } from 'helpers'

@node
@view
export default class Quote {
  render() {
    const { node } = this.props
    console.log('node is', node)

    return <blockquote>{this.props.children}</blockquote>
  }

  static style = {
    blockquote: {
      borderLeft: `2px solid #ddd`,
      paddingLeft: 10,
      marginLeft: 0,
      marginRight: 0,
      fontStyle: 'italic',
    },
  }
}
