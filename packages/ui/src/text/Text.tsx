import { HighlightOptions, highlightText, on } from '@o/utils'
import { alphaColorTheme, CSSPropertySet, gloss, GlossProps, propsToStyles } from 'gloss'
import keycode from 'keycode'
import * as React from 'react'

import { Config } from '../helpers/configureUI'
import { ScaleContext } from '../Scale'
import { Size } from '../Space'
import { SimpleTextPropsBase } from './SimpleText'
import { textSizeTheme } from './textSizeTheme'

type ChildrenHlFn = (Highlights) => JSX.Element | null

export type TextProps = GlossProps<
  Omit<SimpleTextPropsBase, 'ellipse'> &
    React.HTMLAttributes<HTMLParagraphElement> & {
      color?: CSSPropertySet['color'] | false
      editable?: boolean
      autoselect?: boolean
      selectable?: boolean
      onStartEdit?: () => any
      onFinishEdit?: (value: string, event: any) => any
      onCancelEdit?: (value: string, event: any) => any
      nodeRef?: React.RefObject<HTMLElement>
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
      sizeFont?: number | boolean
      measure?: boolean
      onMeasure?: Function
      sizeMethod?: string
      highlight?: HighlightOptions
      wordBreak?: string
      children: React.ReactNode | ChildrenHlFn
      ignoreColor?: boolean
      renderAsHtml?: boolean
    }
>

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
    return this.props.nodeRef || this.ref
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
    if (typeof this.props.ellipse === 'number' && this.props.ellipse > 1) {
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

  finishEdit = (value: string, event: React.KeyboardEvent<any>) => {
    const { onFinishEdit } = this.props
    if (onFinishEdit) {
      onFinishEdit(value, event)
    }
    this.setState({ isEditing: false })
  }

  handleKeydown = (event: React.KeyboardEvent<HTMLParagraphElement>) => {
    const { onCancelEdit, editable, onKeyDown } = this.props
    if (editable) {
      const code = keycode(event as any)
      if (code === 'enter') {
        event.preventDefault()
        event.stopPropagation()
        this.finishEdit(this.value, event)
      }
      if (code === 'esc') {
        event.preventDefault()
        event.stopPropagation()
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
    console.log('double click text', this.props.editable)
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

  onBlur = (event: FocusEvent) => {
    this.finishEdit(this.value, event as any)
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

    // const numLinesToShow = doClamp && Math.floor(textHeight / lineHeightNum)
    const maxHeight = 'auto'
    // typeof ellipse === 'number' && lineHeightNum ? `${ellipse * lineHeightNum}px` : 'auto'
    const oneLineEllipse = typeof ellipse === 'number' && ellipse === 1

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
              const childString = `${index > 0 ? ' ' : ''}${highlightText({
                ...highlight,
                text: `${child}`,
              })}${index === children.length - 1 ? ' ' : ''}`
              // only do dangerous if necessary
              if (childString.includes('<')) {
                return <HTMLBlock key={index}>{childString}</HTMLBlock>
              }
              return childString
            } else {
              return child
            }
          }),
        }
      } else if (typeof children === 'string') {
        __html = highlightText({ ...highlight, text: `${children}` })
      }
      if (__html) {
        // only do dangerous if necessary
        if (__html.includes('<')) {
          finalProps = {
            dangerouslySetInnerHTML: {
              __html,
            },
          }
        } else {
          finalProps = { children: __html }
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
            ellipse={ellipse === 1 || ellipse === true ? true : ellipse}
            numLinesToShow={ellipse}
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
        nodeRef={this.nodeRef}
        ignoreColor={ignoreColor}
        color={color}
        ellipse={ellipse}
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
  applyThemeColor: true,
  display: 'block',
  userSelect: 'none',
  wordBreak: 'break-word',
  position: 'relative',
  minHeight: 'min-content',
  maxWidth: '100%',
  cursor: 'default',
  conditional: {
    selectable: {
      userSelect: 'text',
      cursor: 'inherit',
    },
    oneLineEllipse: {
      overflow: 'hidden',
    },
  },
}).theme(textSizeTheme, propsToStyles, alphaColorTheme)

type TextEllipseProps = TextProps & {
  doClamp?: boolean
}

const TextEllipse = gloss<TextEllipseProps>({
  display: 'inline',
  maxWidth: '100%',
  conditional: {
    ellipse: {
      display: 'block',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  },
}).theme(({ ellipse, doClamp, maxHeight }) => {
  if (ellipse > 1) {
    return {
      WebkitLineClamp: ellipse,
      maxHeight,
      width: doClamp ? '100%' : '100.001%',
      opacity: doClamp ? 1 : 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
    }
  }
})
