import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

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
})

type Props = {
  openMark?: string
  closeMark?: string
  value?: string
  highlight?: (a: string) => Array<[number, number]>
  onChange?: Function
  onFocus?: Function
  onBlur?: Function
  onKeyDown?: Function
  onClick?: Function
  forwardRef?: React.Ref<any>
}

export class HighlightedTextArea extends React.Component<Props> {
  backdrop = React.createRef()

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
    this.setState({ value: event.target.value })
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  handleScroll = event => {
    const scrollTop = event.target.scrollTop
    // @ts-ignore
    this.backdrop.current.scrollTop = scrollTop
  }

  handleRegexHighlight(input, payload) {
    return input.replace(
      payload,
      this.props.openMark + '$&' + this.props.closeMark,
    )
  }

  handleArrayHighlight(input, payload) {
    let offset = 0
    payload.forEach(function(element) {
      // insert open tag
      var open = element[0] + offset
      if (element[2]) {
        const OPEN_MARK_WITH_CLASS = '<mark class="' + element[2] + '">'
        input = input.slice(0, open) + OPEN_MARK_WITH_CLASS + input.slice(open)
        offset += OPEN_MARK_WITH_CLASS.length
      } else {
        input = input.slice(0, open) + this.props.openMark + input.slice(open)
        offset += this.props.openMark.length
      }
      // insert close tag
      var close = element[1] + offset
      input = input.slice(0, close) + this.props.closeMark + input.slice(close)
      offset += this.props.closeMark.length
    }, this)
    return input
  }

  getHighlights() {
    let highlightMarks = this.state.value
    const payload = this.props.highlight(highlightMarks)
    // escape HTML
    highlightMarks = highlightMarks
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    if (payload) {
      switch (payload.constructor.name) {
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
      <TextAreaOuter>
        <Block
          {...props}
          forwardRef={this.backdrop}
          dangerouslySetInnerHTML={{ __html: this.getHighlights() }}
          color="transparent"
        />
        <Block
          tagName="textarea"
          resize="none"
          {...props}
          onChange={this.handleInputChange}
          onScroll={this.handleScroll}
          value={this.state.value}
          forwardRef={forwardRef}
        />
      </TextAreaOuter>
    )
  }
}
