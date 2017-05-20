// @flow
import { view, observable, keycode } from '~/helpers'

@view.ui
export default class Text {
  props: {
    editable?: Boolean,
    autoselect?: Boolean,
    onFinishEdit: Function,
    onCancelEdit: Function,
    getRef?: Function,
  }

  @observable prps = {}
  editClickaway = null
  node = null

  componentWillReceiveProps(nextProps) {
    this.prps = nextProps

    if (!nextProps.editing) {
      this.selected = false
    }
  }

  componentDidMount() {
    this.prps = this.props

    // click away from edit clears it
    this.react(
      () => this.prps.editable,
      editable => {
        if (this.editClickaway) {
          this.editClickaway.dispose()
        }
        if (editable) {
          this.editClickaway = this.addEvent(
            window,
            'click',
            (event: Event) => {
              if (onFinishEdit) {
                onFinishEdit(this.value)
              }
            }
          )
        }
      }
    )
  }

  selected = false

  componentDidUpdate() {
    if (
      this.node &&
      this.props.autoselect &&
      this.props.editable &&
      !this.selected
    ) {
      this.node.focus()
      document.execCommand('selectAll', false, null)
      this.selected = true
    }
  }

  focus = () => {
    this.node && this.node.focus()
  }

  get value() {
    console.log('val', (this.node && this.node.innerText) || '')
    return (this.node && this.node.innerText) || ''
  }

  handleKeydown = (event: Event) => {
    const { onFinishEdit, onCancelEdit, editable, onKeyDown } = this.props

    if (editable) {
      const code = keycode(event)

      if (code === 'enter') {
        event.preventDefault()
        if (onFinishEdit) onFinishEdit(this.value, event)
      }
      if (code === 'esc') {
        event.preventDefault()
        if (onCancelEdit) onCancelEdit(this.value, event)
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }

  getRef = ref => {
    this.node = ref
  }

  render({
    editable,
    autoselect,
    onFinishEdit,
    onCancelEdit,
    onKeyDown,
    ...props
  }) {
    return (
      <text
        contentEditable={editable}
        suppressContentEditableWarning={editable}
        onKeyDown={this.handleKeydown}
        ref={this.getRef}
        $$marginLeft={props.active ? -2 : 0}
        {...props}
      />
    )
  }
}
