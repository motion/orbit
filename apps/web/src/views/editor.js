import { Editor, Raw } from 'slate'
import { view, observable } from 'helpers'

// Create our initial state...
const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true })

@view
export default class DocEditor {
  state = {
    val: initialState
  }

  onChange = (val) => {
    this.setState({ val })
  }

  render() {
    return (
      <Editor
        state={this.state.val}
        onChange={this.onChange}
      />
    )
  }
}
