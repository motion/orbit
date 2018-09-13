import * as React from 'react'
import { view, on } from '@mcro/black'
import keycode from 'keycode'
import { InlineBlock } from './blocks/InlineBlock'
import { Inline } from './blocks/Inline'
import { highlightText, HighlightOptions } from './helpers/highlightText'
import { propsToTextSize } from './helpers/propsToTextSize'
import { alphaColor, CSSPropertySet } from '@mcro/gloss'

export type TextProps = CSSPropertySet & {
  color?: CSSPropertySet['color'] | false
  editable?: boolean
  autoselect?: boolean
  selectable?: boolean
  onFinishEdit?: Function
  onCancelEdit?: Function
  getRef?: Function
  ellipse?: boolean | number
  tagName?: string
  lines?: number
  alpha?: number
  onKeyDown?: Function
  opacity?: number
  size?: number
  onClick?: Function
  onMouseEnter?: Function
  onMouseLeave?: Function
  style?: Object
  placeholder?: string
  lineHeight?: number
  sizeLineHeight?: number
  className?: string
  measure?: boolean
  onMeasure?: Function
  sizeMethod?: string
  highlight?: HighlightOptions
  wordBreak?: string
  theme?: Object
  children: React.ReactNode | ((Highlights) => React.ReactNode)
}

const HTMLBlock = props => <span dangerouslySetInnerHTML={{ __html: ` ${props.children} ` }} />

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

TextBlock.theme = ({ theme, color, alpha }) => {
  if (color === false) {
    return {
      color: 'inherit',
    }
  }
  return alphaColor(
    {
      color: color || theme.color,
    },
    alpha,
  )
}

const TextEllipse = view(Inline, {
  margin: ['auto', 0],
  maxWidth: '100%',
})

TextEllipse.theme = ({ ellipse, doClamp, maxHeight }) => ({
  ...(ellipse > 1 && {
    WebkitLineClamp: ellipse,
    maxHeight,
    width: doClamp ? '100%' : '100.001%',
    opacity: doClamp ? 1 : 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
  }),
  ...((ellipse === 1 || ellipse === true) && {
    display: 'block',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
})

export type Highlights = {
  highlights: string[]
}

@view.ui
export class Text extends React.Component<TextProps> {
  selected = false
  editable = false
  node = null

  static defaultProps = {
    // not a p because its nice to nest it
    tagName: 'div',
  }

  state = {
    doClamp: false,
    textHeight: 0,
  }

  componentDidMount() {
    this.handleProps(this.props)
    // this fixes bug because clamp is hacky af and needs to re-measure to trigger
    this.measure()
  }

  componentDidUpdate() {
    this.handleProps(this.props)
    if (this.node && this.props.autoselect && this.props.editable && !this.selected) {
      this.node.focus()
      document.execCommand('selectAll', false, null)
      this.selected = true
    }
  }

  measure() {
    if (this.props.ellipse > 1) {
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
      ((!!props.ellipse || props.ellipse > 0) && props.ellipse !== this.props.ellipse)
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
      renderAsHtml,
      ...props
    } = this.props
    const { doClamp, textHeight } = this.state
    const text = propsToTextSize(this.props)
    const numLinesToShow = doClamp && Math.floor(textHeight / text.lineHeightNum)
    const maxHeight =
      typeof ellipse === 'number' && text.lineHeightNum
        ? `${ellipse * text.lineHeightNum}px`
        : 'auto'
    const oneLineEllipse = ellipse === 1

    // so we can toggle between html or text
    let finalProps: any = {
      children,
    }

    if (highlight) {
      let __html
      if (Array.isArray(children)) {
        finalProps = {
          children: children.map((child, index) => {
            if (typeof child === 'string') {
              return (
                <HTMLBlock key={index}>{highlightText({ text: child, ...highlight })}</HTMLBlock>
              )
            } else {
              return child
            }
          }),
        }
      } else if (typeof children === 'string') {
        __html = highlightText({ text: children, ...highlight })
      }
      if (__html) {
        finalProps = {
          dangerouslySetInnerHTML: {
            __html,
          },
        }
      }
    } else if (renderAsHtml) {
      finalProps = {
        dangerouslySetInnerHTML: {
          __html: children,
        },
      }
    }

    if (highlight && typeof children === 'function') {
      const highlights = highlightText(highlight)
      finalProps = {
        children: children({ highlights }),
      }
    }

    if (ellipse) {
      finalProps = {
        children: (
          <TextEllipse
            ellipse={ellipse}
            numLinesToShow={numLinesToShow}
            maxHeight={maxHeight}
            doClamp={doClamp}
            color={color}
            {...finalProps}
          />
        ),
      }
    }

    return (
      <TextBlock
        tagName={tagName}
        contentEditable={editable}
        selectable={selectable}
        oneLineEllipse={oneLineEllipse}
        suppressContentEditableWarning={editable}
        onKeyDown={this.handleKeydown}
        forwardRef={this.getRef}
        color={color}
        {...ellipse && {
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
        {...finalProps}
        {...props}
      />
    )
  }
}
