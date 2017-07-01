// @flow
import React from 'react'
import { view, keycode } from '@mcro/black'
import type { ViewType } from '@mcro/black'

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
export default class Text implements ViewType {
  props: Props

  static defaultProps = {
    tagName: 'p',
    size: 1,
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
    store,
    editable,
    autoselect,
    onFinishEdit,
    onCancelEdit,
    onKeyDown,
    selectable,
    ellipse,
    children,
    fontWeight,
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
        <ellipse if={ellipse} $$ellipse>
          {children}
        </ellipse>
      </text>
    )
  }

  static style = {
    text: {
      userSelect: 'none',
      cursor: 'default',
    },
    selectable: {
      userSelect: 'auto',
      cursor: 'text',
    },
    ellipse: {
      height: '100%',
    },
  }

  static theme = (props, theme) => {
    const fontSize = props.fontSize || props.size * 14
    return {
      text: {
        fontSize,
        fontWeight: props.fontWeight,
        lineHeight: `${fontSize + 8}px`,
        color: props.color || theme.base.color,
      },
      ellipse: {
        color: props.color || theme.base.color,
      },
    }
  }
}
