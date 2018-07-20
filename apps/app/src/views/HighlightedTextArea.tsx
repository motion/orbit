import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CSSPropertySet } from '@mcro/gloss'

const oneLine = str => str.replace(/\r?\n|\r/g, '')

const TextAreaOuter = view(UI.Col, {
  position: 'relative',
  width: '100%',
})

const Block = view(UI.Block, {
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  whiteSpace: 'pre',
  wordWrap: 'no-wrap',
})

type Color = string

type Props = CSSPropertySet & {
  openMark?: string
  closeMark?: string
  value?: string
  highlight?: (
    a: string,
  ) => Array<[number, number]> | RegExp | { [index: number]: Color }
  onChange?: Function
  onFocus?: Function
  onBlur?: Function
  onKeyDown?: Function
  onClick?: Function
  forwardRef?: React.Ref<any>
}

export class HighlightedTextArea extends React.Component<Props> {
  highlights = React.createRef()

  static defaultProps = {
    openMark: '<mark>',
    closeMark: '</mark>',
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        value: props.value,
      }
    }
    return null
  }

  state = {
    value: this.props.value,
  }

  handleInputChange = event => {
    this.setState({ value: oneLine(event.target.value) })
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  handleScroll = event => {
    const scrollLeft = event.target.scrollLeft
    // @ts-ignore
    this.highlights.current.scrollLeft = scrollLeft
    console.log('scrolllll', scrollLeft)
  }

  handleRegexHighlight(input, markRegex) {
    return input.replace(
      markRegex,
      this.props.openMark + '$&' + this.props.closeMark,
    )
  }

  handleArrayHighlight(value, markList = []) {
    const sortedMarkList = markList
      .slice()
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    let input = `${value}`
    let offset = 0
    for (const mark of sortedMarkList) {
      // insert open tag
      const open = mark[0] + offset
      if (mark[2]) {
        const OPEN_MARK_WITH_CLASS = '<mark class="' + mark[2] + '">'
        input = input.slice(0, open) + OPEN_MARK_WITH_CLASS + input.slice(open)
        offset += OPEN_MARK_WITH_CLASS.length
      } else {
        input = input.slice(0, open) + this.props.openMark + input.slice(open)
        offset += this.props.openMark.length
      }
      // insert close tag
      const close = mark[1] + offset
      input = input.slice(0, close) + this.props.closeMark + input.slice(close)
      offset += this.props.closeMark.length
    }
    return input
  }

  handleObjectHighlight(input, markWords) {
    const markWithClass = className => {
      const openMark = this.props.openMark.replace(
        '>',
        ` class="${className}">`,
      )
      return inner => `${openMark}${inner}${this.props.closeMark}`
    }
    return input
      .split(' ')
      .map((word, index) => {
        if (markWords[index]) {
          return markWithClass(markWords[index])(word)
        }
        return word
      })
      .join(' ')
  }

  getHighlights() {
    if (!this.props.highlight) {
      return this.state.value
    }
    let highlightMarks = this.state.value
    const payload = this.props.highlight(highlightMarks)
    // escape HTML
    highlightMarks = highlightMarks
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    if (payload) {
      switch (payload.constructor.name) {
        case 'Object':
          highlightMarks = this.handleObjectHighlight(highlightMarks, payload)
          break
        case 'Array':
          highlightMarks = this.handleArrayHighlight(highlightMarks, payload)
          break
        case 'RegExp':
          highlightMarks = this.handleRegexHighlight(highlightMarks, payload)
          break
        default:
          throw 'Unrecognized payload type!'
      }
    }
    // this keeps scrolling aligned when input ends with a newline
    highlightMarks = highlightMarks.replace(
      new RegExp('\\n(' + this.props.closeMark + ')?$'),
      '\n\n$1',
    )
    // highlightMarks = highlightMarks.replace(new RegExp(this.props.openMark, 'g'), '<mark>');
    // highlightMarks = highlightMarks.replace(new RegExp(this.props.closeMark, 'g'), '</mark>');
    return highlightMarks
  }

  render() {
    const { onChange, highlight, value, forwardRef, ...props } = this.props
    return (
      <TextAreaOuter height="100%">
        <Block
          {...props}
          forwardRef={this.highlights}
          dangerouslySetInnerHTML={{ __html: this.getHighlights() }}
          color="transparent"
          overflowX="scroll"
          overflowY="hidden"
          className="hideScrollBar"
        />
        <Block
          tagName="textarea"
          rows={1}
          resize="none"
          {...props}
          onChange={this.handleInputChange}
          onScroll={this.handleScroll}
          value={this.state.value}
          forwardRef={forwardRef}
          className="hideScrollBar"
        />
      </TextAreaOuter>
    )
  }
}
