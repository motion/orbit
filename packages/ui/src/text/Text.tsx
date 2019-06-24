import { CSSPropertySetStrict } from '@o/css'
import { HighlightOptions, highlightText, on } from '@o/utils'
import { alphaColorTheme, CSSPropertySet, getTextSizeTheme, gloss, propStyleTheme } from 'gloss'
import keycode from 'keycode'
import * as React from 'react'

import { Config } from '../helpers/configureUI'
import { ScaleContext } from '../Scale'
import { getTextSize } from '../Sizes'
import { Size } from '../Space'

type ChildrenHlFn = (Highlights) => JSX.Element | null

export type TextProps = CSSPropertySetStrict &
  React.HTMLAttributes<HTMLParagraphElement> & {
    color?: CSSPropertySet['color'] | false
    editable?: boolean
    autoselect?: boolean
    selectable?: boolean
    onStartEdit?: () => any
    onFinishEdit?: (value: string, event: any) => any
    onCancelEdit?: (value: string, event: any) => any
    forwardRef?: React.RefObject<HTMLElement>
    ellipse?: boolean | number
    tagName?: string
    lines?: number
    alpha?: number
    onKeyDown?: Function
    opacity?: number
    size?: Size
    placeholder?: string
    lineHeight?: number
    sizeLineHeight?: number | boolean
    measure?: boolean
    onMeasure?: Function
    sizeMethod?: string
    highlight?: HighlightOptions
    wordBreak?: string
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

  static contextType = ScaleContext

  static defaultProps = {
    // not a p because its nice to nest it
    tagName: 'div',
  }

  state = {
    isEditing: false,
    doClamp: false,
    textHeight: 0,
  }

  componentDidMount() {
    this.handleProps(this.props)
    // this fixes bug because clamp is hacky af and needs to re-measure to trigger
    this.measure()
  }

  ref = React.createRef<HTMLDivElement>()

  get nodeRef() {
    return this.props.forwardRef || this.ref
  }

  get node() {
    return this.nodeRef.current
  }

  componentDidUpdate() {
    this.handleProps(this.props)
    const shouldSelect =
      this.props.editable &&
      this.node &&
      !this.selected &&
      this.props.autoselect &&
      this.state.isEditing
    if (shouldSelect) {
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

  finishEdit = (event, value: string) => {
    const { onFinishEdit } = this.props
    if (onFinishEdit) {
      onFinishEdit(value, event)
    }
    this.setState({ isEditing: false })
  }

  handleKeydown = event => {
    const { onCancelEdit, editable, onKeyDown } = this.props
    if (editable) {
      const code = keycode(event)
      if (code === 'enter') {
        event.preventDefault()
        this.finishEdit(event, this.value)
      }
      if (code === 'esc') {
        event.preventDefault()
        if (onCancelEdit) {
          onCancelEdit(this.value, event)
          this.setState({ isEditing: false })
        }
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }

  handleDoubleClick = event => {
    if (this.props.editable && !this.state.isEditing) {
      event.stopPropagation()
      if (this.props.onStartEdit) {
        this.props.onStartEdit()
      }
      this.setState({
        isEditing: true,
      })
    }
  }

  onBlur = () => {
    this.finishEdit(this.value)
  }

  render() {
    const {
      editable,
      selectable,
      ellipse,
      children,
      tagName,
      color,
      highlight,
      renderAsHtml,
      ignoreColor,
      className,
      ...props
    } = this.props
    const { doClamp, textHeight } = this.state
    const scale = this.context ? this.context.size : 1
    const size = scale * getTextSize(this.props.size)
    const textStyle = getTextSizeTheme({
      sizeLineHeight: this.props.sizeLineHeight,
      lineHeight: this.props.lineHeight,
      fontSize: this.props.fontSize,
      size,
      sizeMethod: this.props.sizeMethod,
    })
    const numLinesToShow = doClamp && Math.floor(textHeight / textStyle.lineHeightNum)
    const maxHeight =
      typeof ellipse === 'number' && textStyle.lineHeightNum
        ? `${ellipse * textStyle.lineHeightNum}px`
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
            className={className}
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
        className={`ui-text ${className || ''}`}
        tagName={tagName}
        {...Config.defaultProps.text}
        contentEditable={editable && this.state.isEditing}
        onBlur={this.onBlur}
        selectable={selectable}
        oneLineEllipse={oneLineEllipse}
        suppressContentEditableWarning={editable}
        ref={this.nodeRef}
        ignoreColor={ignoreColor}
        color={color}
        ellipse={ellipse}
        fontSize={textStyle.fontSize}
        lineHeight={textStyle.lineHeight}
        marginTop={textStyle.marginTop}
        marginBottom={textStyle.marginBottom}
        onDoubleClick={this.handleDoubleClick}
        {...props}
        {...finalProps}
        // override props
        onKeyDown={this.handleKeydown}
      />
    )
  }
}

const HTMLBlock = props => <span dangerouslySetInnerHTML={{ __html: `${props.children}` }} />

const TextBlock = gloss({
  display: 'block',
  userSelect: 'none',
  wordBreak: 'break-word',
  position: 'relative',
  minHeight: 'min-content',
  maxWidth: '100%',
  selectable: {
    userSelect: 'text',
  },
  oneLineEllipse: {
    overflow: 'hidden',
  },
}).theme(propStyleTheme, alphaColorTheme, selectableTheme)

export function selectableTheme(props) {
  return {
    cursor:
      props.cursor ||
      (props.selectable === false ? 'default' : props.selectable === true ? 'inherit' : 'inherit'),
  }
}

const TextEllipse = gloss({
  display: 'inline',
  maxWidth: '100%',
}).theme(propStyleTheme, ellipseTheme)

function ellipseTheme({ ellipse, doClamp, maxHeight }) {
  if (ellipse === 1 || ellipse === true)
    return {
      display: 'block',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    } as const
  if (ellipse > 1)
    return {
      WebkitLineClamp: ellipse,
      maxHeight,
      width: doClamp ? '100%' : '100.001%',
      opacity: doClamp ? 1 : 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
    } as const
}
