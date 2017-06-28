// @flow
import React from 'react'
import { view, keycode } from '@mcro/black'

export type Props = {
  editable?: Boolean,
  autoselect?: Boolean,
  onFinishEdit: Function,
  onCancelEdit: Function,
  getRef?: Function,
}

// click away from edit clears it
@view({
  store: class TextStore {
    selected = false

    start() {
      this.react(
        () => this.props.editable,
        editable => {
          console.log('text react editable', editable)
          if (this.clickaway) {
            this.clickaway.dispose()
          }
          if (editable) {
            this.clickaway = this.addEvent(window, 'click', (event: Event) =>
              this.props.onFinishEdit(this.value)
            )
          }
        }
      )
    }
  },
})
export default class Text {
  props: Props

  static defaultProps = {
    onFinishEdit: _ => _,
    onCancelEdit: _ => _,
  }

  node = null

  componentWillReceiveProps(nextProps) {
    if (!nextProps.editing) {
      this.props.store.selected = false
    }
  }

  componentDidUpdate() {
    if (
      this.node &&
      this.props.autoselect &&
      this.props.editable &&
      !this.selected
    ) {
      this.node.focus()
      document.execCommand('selectAll', false, null)
      this.props.store.selected = true
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
        onFinishEdit(this.value, event)
      }
      if (code === 'esc') {
        event.preventDefault()
        onCancelEdit(this.value, event)
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }

  render({
    store,
    editable,
    autoselect,
    onFinishEdit,
    onCancelEdit,
    onKeyDown,
    ...props
  }: Props) {
    return (
      <text
        contentEditable={editable}
        suppressContentEditableWarning={editable}
        onKeyDown={this.handleKeydown}
        ref={this.ref('node').set}
        $$marginLeft={props.active ? -2 : 0}
        {...props}
      />
    )
  }
}
