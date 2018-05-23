import * as React from 'react'
import { view } from '@mcro/black'
import keycode from 'keycode'
import $ from 'color'

const wrapHighlights = (text, highlightWordsColor, highlightWords) => {
  let result = text
  for (const word of highlightWords) {
    result = result.replace(
      new RegExp(`(${word})`, 'g'),
      `<span style="color: ${highlightWordsColor}; font-weight: 500;">$1</span>`,
    )
  }
  return result
}

const getTextProperties = props => {
  let fontSizeNum
  let lineHeightNum
  let fontSize = props.fontSize
  if (typeof fontSize === 'undefined' && props.size) {
    fontSize = props.size * 14
  }
  let lineHeight = props.lineHeight
  if (typeof lineHeight === 'undefined' && typeof fontSize === 'number') {
    lineHeight = Math.log(fontSize * 500) * 2.5 + fontSize / 1.4 - 8
    if (props.sizeLineHeight) {
      lineHeight = lineHeight * props.sizeLineHeight
    }
  }
  // round
  if (typeof fontSize === 'number') {
    fontSizeNum = Math.round(fontSize * 10) / 10
  }
  if (typeof lineHeight === 'number') {
    lineHeightNum = Math.round(lineHeight * 10) / 10
  }
  if (typeof props.sizeMethod === 'undefined') {
    lineHeight = `${lineHeightNum}px`
    fontSize = `${fontSizeNum}px`
  } else if (props.sizeMethod === 'vw') {
    lineHeight = `${lineHeightNum / 12}vw`
    fontSize = `${fontSizeNum / 12}vw`
  }
  return { fontSize, fontSizeNum, lineHeight, lineHeightNum }
}

// export type Props = {
//   editable?: boolean,
//   autoselect?: boolean,
//   selectable?: boolean,
//   onFinishEdit?: Function,
//   onCancelEdit?: Function,
//   getRef?: Function,
//   ellipse?: boolean,
//   tagName: string,
//   fontWeight?: number,
//   lines?: number,
//   alpha?: number,
// }

// click away from edit clears it
@view.ui
export default class Text {
  selected = false
  editable = false
  node = null

  static defaultProps = {
    // not a p because its nice to nest it
    tagName: 'text',
    size: 1,
  }

  state = {
    doClamp: false,
    textHeight: 0,
  }

  get multiLineEllipse() {
    return this.props.ellipse > 1 || this.props.ellipse === true
  }

  componentWillMount() {
    this.handleProps(this.props)
  }

  componentDidMount() {
    // this fixes bug because clamp is hacky af and needs to re-measure to trigger
    this.measure()
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps)
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
      this.setTimeout(() => {
        this.setState({ clamp: false }, () => {
          this.measure()
        })
      })
    }
    // setup reaction for editing if necessary
    // if (!this.editableReaction && props.editable) {
    //   this.editableReaction = this.react(
    //     () => this.editable,
    //     editable => {
    //       if (this.clickaway) {
    //         this.clickaway()
    //       }
    //       if (editable) {
    //         // this.clickaway = this.on(window, 'click', (event: Event) => {
    //         //   if (this.props.onFinishEdit) {
    //         //     this.props.onFinishEdit(this.value)
    //         //   }
    //         // })
    //       }
    //     },
    //     true,
    //   )
    // }
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

  handleKeydown(event) {
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

  getRef(node) {
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
    highlightWords,
    sizeLineHeight,
    highlightWordsColor,
    className,
    measure,
    debug,
    onMeasure,
    sizeMethod,
    ...props
  }) {
    const { multiLineEllipse } = this
    const { doClamp, textHeight } = this.state
    const text = getTextProperties(this.props)
    const numLinesToShow =
      doClamp && Math.floor(textHeight / text.lineHeightNum)
    const maxHeight =
      typeof ellipse === 'number' && text.lineHeightNum
        ? `${ellipse * text.lineHeightNum}px`
        : 'auto'
    const oneLineEllipse = ellipse === 1
    let ellipseProps = { children }
    if (highlightWords) {
      if (typeof children === 'string') {
        ellipseProps = {
          dangerouslySetInnerHTML: {
            __html: wrapHighlights(
              children,
              highlightWordsColor,
              highlightWords,
            ),
          },
        }
      } else {
        console.warn('Expected chidlren to be string for highlighting')
      }
    }
    console.log('text style', style, this.props)
    return (
      <text
        className={className}
        tagName={tagName}
        contentEditable={editable}
        $selectable={selectable}
        suppressContentEditableWarning={editable}
        onKeyDown={e => this.handleKeydown(e)}
        ref={n => this.getRef(n)}
        css={props}
        style={style}
        $oneLineEllipse={oneLineEllipse}
        {...{
          onClick,
          onMouseEnter,
          onMouseLeave,
          onFocus,
          onBlur,
        }}
      >
        {!ellipse && children}
        <span
          if={ellipse}
          $ellipseLines={multiLineEllipse}
          $ellipseSingle={oneLineEllipse}
          style={
            multiLineEllipse
              ? {
                  WebkitLineClamp:
                    ellipse === true ? numLinesToShow || 10000 : ellipse,
                  maxHeight,
                  width: doClamp ? '100%' : '100.001%',
                  opacity: doClamp ? 1 : 0,
                }
              : null
          }
          {...ellipseProps}
        />
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
    oneLineEllipse: {
      display: 'flex',
      overflow: 'hidden',
    },
    ellipseLines: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      width: '100%',
    },
    ellipseSingle: {
      display: 'block',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
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
    console.log('runnig theme for text', props)
    const { fontSize, lineHeight } = getTextProperties(props)
    let color = props.color || theme.base.color
    // allow alpha adjustments
    if (typeof props.alpha === 'number' && color !== 'inherit') {
      color = $(color).alpha(props.alpha)
    }
    return {
      text: {
        color,
        fontSize,
        lineHeight,
        textTransform: props.textTransform,
        textShadow: props.textShadow,
        display: props.display,
        fontWeight: props.fontWeight || props.weight,
        opacity: props.opacity,
        margin: props.margin,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        marginTop: props.marginTop,
        padding: props.padding,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        paddingTop: props.paddingTop,
      },
      ellipse: {
        color,
        wordBreak: 'inherit',
      },
    }
  }
}
