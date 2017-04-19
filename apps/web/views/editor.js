import { Editor, EditorState } from 'draft-js'
import { view, observable } from '~/helpers'

@view
export default class DocEditor {
  @observable state = EditorState.createEmpty()

  render() {
    return (
      <Editor
        editorState={this.state}
        onChange={state => this.state = state}
      />
    );
  }
}
