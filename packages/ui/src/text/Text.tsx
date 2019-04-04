import { CSSPropertySetStrict } from '@o/css'
import { alphaColor, CSSPropertySet, gloss, propsToTextSize } from '@o/gloss'
import { HighlightOptions, highlightText, on } from '@o/utils'
import keycode from 'keycode'
import * as React from 'react'
import { ScaleContext } from '../Scale'
import { View } from '../View/View'

type ChildrenHlFn = (Highlights) => JSX.Element | null

export type TextProps = CSSPropertySetStrict &
  React.HTMLAttributes<HTMLParagraphElement> & {
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
    style?: Object
    placeholder?: string
    lineHeight?: number
    sizeLineHeight?: number
    measure?: boolean
    onMeasure?: Function
    sizeMethod?: string
    highlight?: HighlightOptions
    wordBreak?: string
    theme?: Object
    children: React.ReactNode | ChildrenHlFn
    ignoreColor?: boolean
    renderAsHtml?: boolean
  }

export type Highlights = {
  highlights: string[]
}

export class Text extends React.PureComponent<TextProps> {
  selected = false
  editable = false
  node = null

  static contextType = ScaleContext

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
      ignoreColor,
      ...props
    } = this.props
    const { doClamp, textHeight } = this.state
    const scale = this.context ? this.context.size : 1
    const size = scale * (this.props.size || 1)
    const textProps = propsToTextSize({
      sizeLineHeight: this.props.sizeLineHeight,
      lineHeight: this.props.lineHeight,
      fontSize: this.props.fontSize,
      size,
      sizeMethod: this.props.sizeMethod,
    })
    const numLinesToShow = doClamp && Math.floor(textHeight / textProps.lineHeightNum)
    const maxHeight =
      typeof ellipse === 'number' && textProps.lineHeightNum
        ? `${ellipse * textProps.lineHeightNum}px`
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
                <HTMLBlock key={index}>
                  {`${index > 0 ? ' ' : ''}${highlightText({ text: child, ...highlight })}${
                    index === children.length - 1 ? ' ' : ''
                  }`}
                </HTMLBlock>
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
        children: (children as ChildrenHlFn)({ highlights }),
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
        ref={this.getRef}
        ignoreColor={ignoreColor}
        color={color}
        ellipse={ellipse}
        fontSize={textProps.fontSize}
        lineHeight={textProps.lineHeight}
        {...props}
        {...finalProps}
      />
    )
  }
}

const HTMLBlock = props => <span dangerouslySetInnerHTML={{ __html: `${props.children}` }} />

const TextBlock = gloss(View, {
  userSelect: 'none',
  wordBreak: 'break-word',
  position: 'relative',
  maxWidth: '100%',
  minHeight: 'min-content',
  selectable: {
    userSelect: 'text',
    cursor: 'inherit',
  },
  oneLineEllipse: {
    overflow: 'hidden',
  },
}).theme(({ ignoreColor, alpha, alphaHover, color }, theme) => {
  if (ignoreColor) {
    return {
      color: 'inherit',
    }
  }
  return {
    ...alphaColor({ color: color || theme.color }, { alpha, alphaHover }),
  }
})

const TextEllipse = gloss({
  display: 'inline',
  maxWidth: '100%',
}).theme(({ ellipse, doClamp, maxHeight }) => ({
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
}))
