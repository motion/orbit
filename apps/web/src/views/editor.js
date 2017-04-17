import { Editor, EditorState, RichUtils } from 'draft-js'
import { view, toJS, observable } from 'helpers'

@view
export default class DocEditor {
  @observable baby = 0
  state = EditorState.createEmpty()

  onChange = (val) => {
    this.state = val
    this.baby = this.baby + 1
    console.log('do it', this.baby)
  }

  render() {
    console.log('render', this.baby)
    window.x = this
    return (
      <editor>
        {this.baby}
        <Editor
          editorState={this.state}
          onChange={this.onChange}
        />
      </editor>
    )
  }
}
