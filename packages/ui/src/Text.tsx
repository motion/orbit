import * as React from 'react'
import { view, on } from '@mcro/black'
import keycode from 'keycode'
import { InlineBlock } from './blocks/InlineBlock'
import { Inline } from './blocks/Inline'
import { highlightText } from './helpers/highlightText'
import { Color } from '@mcro/css'
import { propsToTextSize } from './helpers/propsToTextSize'

const TextBlock = view(InlineBlock, {
  userSelect: 'none',
  wordBreak: 'break-word',
  position: 'relative',
  maxWidth: '100%',
  selectable: {
    userSelect: 'auto',
    cursor: 'inherit',
  },
  oneLineEllipse: {
    overflow: 'hidden',
  },
})

const TextEllipse = view(Inline, {
  margin: ['auto', 0],
  maxWidth: '100%',
  wordBreak: 'inherit',
})

TextEllipse.theme = ({ ellipse }) => ({
  ...(ellipse > 1 && {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    width: '100%',
  }),
  ...((ellipse === 1 || ellipse === true) && {
    display: 'block',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
})

export type TextProps = {
  editable?: boolean
  autoselect?: boolean
  selectable?: boolean
  onFinishEdit?: Function
  onCancelEdit?: Function
  getRef?: Function
  ellipse?: boolean | number
  tagName: string
  fontWeight?: number
  lines?: number
  alpha?: number
  onKeyDown?: Function
  fontSize?: number
  color?: Color
  opacity?: number
  size?: number
  onClick?: Function
  onMouseEnter?: Function
  onMouseLeave?: Function
  style?: Object
  placeholder?: string
  lineHeight?: number
  sizeLineHeight?: number
  className?: number
  measure?: boolean
  onMeasure?: Function
  sizeMethod?: string
  highlight?: Object
  wordBreak?: string
  theme?: Object
}

@view.ui
export class Text extends React.Component<TextProps> {
  selected = false
  editable = false
  node = null

  static defaultProps = {
    // not a p because its nice to nest it
    tagName: 'div',
    size: 1,
  }

  state = {
    doClamp: false,
    textHeight: 0,
  }

  get multiLineEllipse() {
    return this.props.ellipse > 1 || this.props.ellipse === true
  }

  componentDidMount() {
    this.handleProps(this.props)
    // this fixes bug because clamp is hacky af and needs to re-measure to trigger
    this.measure()
  }

  componentDidUpdate() {
    this.handleProps(this.props)
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

  measure() {
    if (this.multiLineEllipse) {
      this.setState(
        {
          doClamp: true,
          textHeight: this.node ? this.node.clientHeight : 0,
        },
        () => {
          if (this.props.onMeasure) {
            this.props.onMeasure()
          }
        },
      )
    }
  }

  handleProps(props) {
    if (
      props.measure ||
      ((!!props.ellipse || props.ellipse > 0) &&
        props.ellipse !== this.props.ellipse)
    ) {
      on(
        this,
        setTimeout(() => {
          this.setState({ clamp: false }, () => {
            this.measure()
          })
        }),
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

  focus() {
    this.node && this.node.focus()
  }

  get value() {
    return (this.node && this.node.innerText) || ''
  }

  handleKeydown = event => {
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

  getRef = node => {
    if (node) {
      this.node = node
      if (this.props.getRef) {
        this.props.getRef(node)
      }
    }
  }

  render() {
    const {
      editable,
      autoselect,
      selectable,
      ellipse,
      children,
      tagName,
      getRef,
      onKeyDown,
      color,
      measure,
      highlight,
      ...props
    } = this.props
    const { multiLineEllipse } = this
    const { doClamp, textHeight } = this.state
    const text = propsToTextSize(this.props)
    const numLinesToShow =
      doClamp && Math.floor(textHeight / text.lineHeightNum)
    const maxHeight =
      typeof ellipse === 'number' && text.lineHeightNum
        ? `${ellipse * text.lineHeightNum}px`
        : 'auto'
    const oneLineEllipse = ellipse === 1
    let ellipseProps = {}
    if (highlight) {
      if (typeof children === 'string') {
        const __html = highlightText({
          text: children,
          ...highlight,
        })
        ellipseProps = {
          dangerouslySetInnerHTML: {
            __html,
          },
        }
      } else {
        console.warn('Expected chidlren to be string for highlighting')
      }
    }
    if (multiLineEllipse) {
      ellipseProps = {
        ...ellipseProps,
        WebkitLineClamp: ellipse === true ? numLinesToShow || 10000 : ellipse,
        maxHeight,
        width: doClamp ? '100%' : '100.001%',
        opacity: doClamp ? 1 : 0,
      }
    }
    const showEllipse = highlight || ellipse
    return (
      <TextBlock
        contentEditable={editable}
        selectable={selectable}
        oneLineEllipse={oneLineEllipse}
        suppressContentEditableWarning={editable}
        onKeyDown={this.handleKeydown}
        forwardRef={this.getRef}
        color={color}
        {...props}
      >
        {!showEllipse && children}
        {showEllipse ? (
          <TextEllipse ellipse={ellipse} color={color} {...ellipseProps}>
            {!highlight ? children : null}
          </TextEllipse>
        ) : null}
      </TextBlock>
    )
  }
}
