import { Editor, EditorState, RichUtils } from 'draft-js'
import { view } from '~/helpers'

const plugins = []

@view
export default class DocEditor {
  static defaultProps = {
    state: EditorState.createEmpty(),
  }

  handleKeyCommand = (command) => {
    if (this.keyBindings.length) {
      const kb = this.keyBindings.find(k => k.name === command)
      if (kb) {
        kb.action()
        return true
      }
    }
    const newState = RichUtils.handleKeyCommand(this.props.state, command)
    if (newState) {
      this.props.onChange(newState)
      return true
    }
    return false
  }

  handleReturn = (event) => {
    if (!event.shiftKey) { return false }
    const newState = RichUtils.insertSoftNewline(this.props.state)
    this.props.onChange(newState)
    return true
  }

  render() {
    return (
      <editor>
        <Editor
          editorState={this.props.state}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          handleReturn={this.handleReturn}
          plugins={plugins}
          ref={this.ref('editor').set}
        />
        <Toolbar />
      </editor>
    )
  }
}
