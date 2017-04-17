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
  @observable state = initialState

  onChange = (val) => {
    this.state = val
    console.log('do it', val)
  }

  render() {
    console.log('render', this.baby)
    return (
      <Editor
        editorState={this.state}
        onChange={this.onChange}
      />
    )
  }
}
