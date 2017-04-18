import { Editor, Raw } from 'slate'
import { Component, view, observable } from 'helpers'

export { Raw } from 'slate'

@view
export default class DocEditor extends Component {
  state = {
    val: Raw.deserialize(this.props.content, { terse: true }),
  }

  onChange = val => {
    this.setState({ val })
    if (this.props.onChange) {
      this.props.onChange(val)
    }
  }

  render() {
    return <Editor state={this.state.val} onChange={this.onChange} />
  }
}
