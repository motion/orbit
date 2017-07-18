import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { messages } from './fakeData'
import Gemstone from '~/views/gemstone'

class StickyNode extends React.Component {
  state = {}

  componentDidMount() {
    let { restrictorNode } = this.props
    if (restrictorNode) {
      this.adjustPosition(restrictorNode)
    }
  }

  componentWillUnmount() {
    this.cancelAdjustPosition()
  }

  componentWillReceiveProps(nextProps) {
    let { restrictorNode } = nextProps
    this.cancelAdjustPosition()
    if (restrictorNode) {
      this.adjustPosition(restrictorNode)
    }
  }

  adjustPosition(restrictorNode) {
    let rect = restrictorNode.getBoundingClientRect() || {}
    if (rect.width !== this.state.rectWidth) {
      this.setState({ rectWidth: rect.width })
    }
    if (rect.height !== this.state.rectHeight) {
      this.setState({ rectHeight: rect.height })
    }
    if (rect.left !== this.state.rectLeft) {
      this.setState({ rectLeft: rect.left })
    }
    if (rect.right !== this.state.rectRight) {
      this.setState({ rectRight: rect.right })
    }
    if (rect.top !== this.state.rectTop) {
      this.setState({ rectTop: rect.top })
    }
    if (rect.bottom !== this.state.rectBottom) {
      this.setState({ rectBottom: rect.bottom })
    }

    let ref = this._ref.getBoundingClientRect() || {}
    if (ref.width !== this.state.refWidth) {
      this.setState({ refWidth: ref.width })
    }
    if (ref.height !== this.state.refHeight) {
      this.setState({ refHeight: ref.height })
    }
    if (ref.left !== this.state.refLeft) {
      this.setState({ refLeft: ref.left })
    }
    if (ref.right !== this.state.refRight) {
      this.setState({ refRight: ref.right })
    }
    if (ref.top !== this.state.refTop) {
      this.setState({ refTop: ref.top })
    }
    if (ref.bottom !== this.state.refBottom) {
      this.setState({ refBottom: ref.bottom })
    }

    this._animationFrame = window.requestAnimationFrame(() =>
      this.adjustPosition(restrictorNode)
    )
  }

  cancelAdjustPosition() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame)
    }
  }

  render() {
    let {
      className,
      style,
      onMaxWidth,
      onMaxHeight,
      restrictorNode,
    } = this.props
    let {
      rectWidth,
      rectHeight,
      rectLeft,
      rectRight,
      rectTop,
      rectBottom,

      refWidth,
      refHeight,
      refLeft,
      refRight,
      refTop,
      refBottom,
    } = this.state

    let rightOverflow = refRight - rectRight
    let leftOverflow = rectLeft - refLeft
    let topOverflow = rectTop - refTop
    let bottomOverflow = refBottom - rectBottom

    let maxWidth = 'none'
    if (refWidth >= rectWidth) {
      maxWidth = rectWidth + 'px'
    }

    let maxHeight = 'none'
    if (refHeight >= rectHeight) {
      maxHeight = rectHeight + 'px'
    }

    let styles = {
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      position: 'absolute',
    }

    let left = 0
    if (leftOverflow > 0) {
      left = leftOverflow + 'px'
    }
    if (rightOverflow > 0) {
      left = -rightOverflow + 'px'
    }

    let top = 0
    if (topOverflow > 0) {
      top = topOverflow + 'px'
    }
    if (bottomOverflow > 0) {
      top = -bottomOverflow + 'px'
    }

    const stickyStyle = {
      position: 'relative',
      left,
      top,
    }

    return (
      <div
        ref={ref => (this._ref = ref)}
        className={className}
        style={{ ...styles, ...style }}
      >
        <div style={stickyStyle}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

import timeAgo from 'time-ago'

const { ago } = timeAgo()

@view
export default class Message {
  render({ doc, embed }) {
    const fakeMsg = messages[0]

    return (
      <message $embed={embed}>
        <doc>
          <DocumentView if={!embed} readOnly noTitle document={doc} />
          <fake if={embed}>
            {fakeMsg.message}
          </fake>
        </doc>
        <meta>
          <metacontents>
            <before>
              <UI.Title size={0.9} color="#000">
                {fakeMsg.name}
              </UI.Title>
              <UI.Text size={0.9} color="#999">
                {ago(doc.createdAt)}
              </UI.Text>
            </before>
            <Gemstone id={fakeMsg.name} marginLeft={10} />
          </metacontents>
        </meta>
      </message>
    )
  }

  static style = {
    message: {
      padding: [25, 20],
      borderTop: [1, '#eee'],
      flexFlow: 'row',
      alignItems: 'flex-start',
      position: 'relative',
    },
    metacontents: {
      textAlign: 'right',
      flexFlow: 'row',
      width: 120,
    },
    // leaves room for left bar
    doc: {
      marginLeft: -25,
      flex: 1,
    },
    fake: {
      color: '#333',
      padding: [5, 20],
      lineHeight: 1.2,
    },
    actions: {
      justifyContent: 'space-between',
    },
  }
}
