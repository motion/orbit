import { Editor, EditorState, RichUtils } from 'draft-js'
import { view, observable } from '~/helpers'
import createToolbarPlugin from 'last-draft-js-toolbar-plugin'

const toolbarPlugin = createToolbarPlugin()
const { Toolbar } = toolbarPlugin

const plugins = [
  toolbarPlugin,
]

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
