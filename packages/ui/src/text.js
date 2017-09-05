// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { keycode } from '@mcro/ui'
import { observable } from 'mobx'

export type Props = {
  editable?: boolean,
  autoselect?: boolean,
  selectable?: boolean,
  onFinishEdit?: Function,
  onCancelEdit?: Function,
  getRef?: Function,
  ellipse?: boolean,
  tagName: string,
  fontWeight?: number,
}

// click away from edit clears it
@view.ui
export default class Text extends React.Component<Props> {
  static defaultProps = {
    tagName: 'text', // TODO: prod p mode
    size: 1,
  }

  editableReaction: ?Function
  @observable selected = false
  @observable editable = false
  node = null

  componentWillMount() {
    this.handleProps(this.props)
  }

  componentWillReceiveProps(nextProps: Object) {
    this.handleProps(nextProps)
  }

  handleProps(props: Object) {
    // setup reaction for editing if necessary
    if (!this.editableReaction) {
      this.editableReaction = this.react(
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
        },
        true
      )
    }
    // set props
    if (!props.editing && this.selected) {
      this.selected = false
    }
    if (this.editable !== props.editable) {
      this.editable = props.editable
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
      this.selected = true
    }
  }

  focus() {
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

  getRef = (node: any) => {
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
    css,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    getRef,
    style,
    placeholder,
    lineHeight,
    ...props
  }: Props) {
    const eventProps = {
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
    }
    return (
      <text
        tagName={tagName}
        contentEditable={editable}
        $selectable={selectable}
        suppressContentEditableWarning={editable}
        onKeyDown={this.handleKeydown}
        ref={this.getRef}
        style={style}
        css={{ ...props, ...css }}
        $ellipseText={ellipse}
        {...eventProps}
      >
        {!ellipse && children}
        <span if={ellipse} $$ellipse>
          {children}
        </span>
      </text>
    )
  }

  static style = {
    text: {
      display: 'block',
      userSelect: 'none',
      cursor: 'default',
      maxWidth: '100%',
      wordBreak: 'break-word',
      position: 'relative',
    },
    ellipseText: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
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
        lineHeight:
          typeof props.lineHeight === 'number'
            ? `${props.lineHeight}px`
            : props.lineHeight || `${fontSize + 8}px`,
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
