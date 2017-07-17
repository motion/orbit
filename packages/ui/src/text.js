// @flow
import React from 'react'
import { view, keycode, observable } from '@mcro/black'

export type Props = {
  editable?: boolean,
  autoselect?: boolean,
  selectable?: boolean,
  onFinishEdit: Function,
  onCancelEdit: Function,
  getRef?: Function,
  ellipse?: boolean,
  tagName: string,
  fontWeight?: number,
}

// click away from edit clears it
@view
export default class Text {
  props: Props

  static defaultProps = {
    tagName: 'text', // TODO: prod p mode
    size: 1,
  }

  @observable selected = false
  @observable editable = false
  node = null

  componentWillMount() {
    this.react(
      () => this.editable,
      editable => {
        if (this.clickaway) {
          this.clickaway.dispose()
        }
        if (editable) {
          // this.clickaway = this.addEvent(window, 'click', (event: Event) => {
          //   if (this.props.onFinishEdit) {
          //     this.props.onFinishEdit(this.value)
          //   }
          // })
        }
      }
    )
    this.editable = this.props.editable
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.editing) {
      this.selected = false
    }
    this.editable = nextProps.editable
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
      this.selected = true
    }
  }

  focus = () => {
    this.node && this.node.focus()
  }

  get value() {
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

  getRef = (node: HTMLElement) => {
    if (node) {
      this.node = node
      if (this.props.getRef) {
        this.props.getRef(node)
      }
    }
  }

  render({
    editable,
    autoselect,
    onFinishEdit,
    onCancelEdit,
    onKeyDown,
    selectable,
    ellipse,
    children,
    fontWeight,
    fontSize,
    color,
    opacity,
    size,
    tagName,
    getRef,
    ...props
  }: Props) {
    return (
      <text
        tagName={tagName}
        contentEditable={editable}
        $selectable={selectable}
        suppressContentEditableWarning={editable}
        onKeyDown={this.handleKeydown}
        ref={this.getRef}
        {...props}
      >
        {!ellipse && children}
        <span if={ellipse} $ellipse $$ellipse>
          {children}
        </span>
      </text>
    )
  }

  static style = {
    text: {
      userSelect: 'none',
      cursor: 'default',
      maxWidth: '100%',
      wordBreak: 'break-all',
    },
    selectable: {
      userSelect: 'auto',
      cursor: 'text',
    },
  }

  static theme = (props, theme) => {
    const fontSize =
      (typeof props.fontSize === 'number' && props.fontSize) || props.size * 14
    return {
      text: {
        fontSize,
        fontWeight: props.fontWeight,
        lineHeight: `${fontSize + 8}px`,
        color: props.color || theme.base.color,
        opacity: props.opacity,
      },
      ellipse: {
        color: props.color || theme.base.color,
        wordBreak: 'inherit',
      },
    }
  }
}
