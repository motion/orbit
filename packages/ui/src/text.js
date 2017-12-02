// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import keycode from 'keycode'
import $ from 'color'
import { pick } from 'lodash'

const getTextProperties = props => {
  let fontSizeNum
  let lineHeightNum
  let fontSize = props.fontSize
  if (typeof fontSize === 'undefined' && props.size) {
    fontSize = props.size * 14
  }
  let lineHeight = props.lineHeight
  if (typeof lineHeight === 'undefined' && typeof fontSize === 'number') {
    lineHeight = fontSize * 1.15 + 2.5 * (fontSize / 10)
  }
  if (typeof fontSize === 'number') {
    fontSizeNum = Math.round(fontSize * 10) / 10
    fontSize = `${fontSizeNum}px`
  }
  if (typeof lineHeight === 'number') {
    lineHeightNum = Math.round(lineHeight * 10) / 10
    lineHeight = `${lineHeightNum}px`
  }
  return { fontSize, fontSizeNum, lineHeight, lineHeightNum }
}

const DOM_EVENTS = [
  'onClick',
  'onDoubleClick',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseOver',
  'onMouseOut',
  'onHover',
  'onFocus',
  'onBlur',
]

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
  lines?: number,
  alpha?: number,
}

// click away from edit clears it
@view.ui
export default class Text extends React.Component<Props> {
  static defaultProps = {
    tagName: 'text', // TODO: prod p mode
    size: 1,
  }

  state = {
    doClamp: false,
  }

  editableReaction: ?Function
  selected = false
  editable = false
  node = null

  componentWillMount() {
    this.handleProps(this.props)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.getRef = this.getRef.bind(this)
  }

  componentDidMount() {
    // this fixes bug because clamp is hacky af and needs to re-measure to trigger
    if (this.props.ellipse > 1) {
      this.setTimeout(() => {
        this.setState({ doClamp: true })
      })
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    this.handleProps(nextProps)
  }

  handleProps(props: Object) {
    // setup reaction for editing if necessary
    if (!this.editableReaction && props.editable) {
      this.editableReaction = this.react(
        () => this.editable,
        editable => {
          if (this.clickaway) {
            this.clickaway.dispose()
          }
          if (editable) {
            // this.clickaway = this.on(window, 'click', (event: Event) => {
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
    if (typeof props.editing !== 'undefined') {
      if (!props.editing && this.selected) {
        this.selected = false
      }
    }
    if (typeof props.editable !== 'undefined') {
      if (this.editable !== props.editable) {
        this.editable = props.editable
      }
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

  handleKeydown(event: Event) {
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

  getRef(node: any) {
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
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    getRef,
    style,
    placeholder,
    lineHeight,
    attach,
    className,
    html,
    ...props
  }: Props) {
    const text = getTextProperties(this.props)
    const maxHeight =
      ellipse && text.lineHeightNum
        ? `${ellipse * text.lineHeightNum}px`
        : 'auto'
    const eventProps = {
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
    }
    let inner = html ? (
      <span dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      children
    )
    const oneLineEllipse = ellipse && typeof ellipse === 'boolean'
    const multiLineEllipse = ellipse > 1
    return (
      <text
        className={className}
        tagName={tagName}
        contentEditable={editable}
        $selectable={selectable}
        suppressContentEditableWarning={editable}
        onKeyDown={this.handleKeydown}
        ref={this.getRef}
        css={props}
        style={style}
        $ellipseText={oneLineEllipse}
        {...eventProps}
        {...pick(props, DOM_EVENTS)}
      >
        {!ellipse && inner}
        <span
          if={ellipse}
          $ellipseLines={multiLineEllipse}
          style={
            multiLineEllipse
              ? {
                  WebkitLineClamp: ellipse,
                  maxHeight,
                  width: this.state.doClamp ? '100%' : '100.001%',
                  opacity: this.state.doClamp ? 1 : 0,
                }
              : null
          }
          $$ellipse={oneLineEllipse}
        >
          {inner}
        </span>
      </text>
    )
  }

  static style = {
    text: {
      display: 'inline-block',
      userSelect: 'none',
      cursor: 'default',
      wordBreak: 'break-word',
      position: 'relative',
      maxWidth: '100%',
    },
    ellipseText: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    ellipseLines: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      width: '100%',
    },
    span: {
      margin: ['auto', 0],
      maxWidth: '100%',
    },
    selectable: {
      userSelect: 'auto',
      cursor: 'text',
    },
  }

  static theme = (props, theme) => {
    const { fontSize, lineHeight } = getTextProperties(props)
    let color = props.color || theme.base.color
    // allow alpha adjustments
    if (typeof props.alpha === 'number') {
      color = $(color).alpha(props.alpha)
    }
    return {
      text: {
        color,
        fontSize,
        lineHeight,
        textShadow: props.textShadow,
        display: props.display,
        fontWeight: props.fontWeight,
        opacity: props.opacity,
      },
      ellipse: {
        color,
        wordBreak: 'inherit',
      },
    }
  }
}
