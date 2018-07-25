import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

type Props = {
  term: string
}

type Measurement = {
  x: number
  y: number
  width: number
  height: number
}

type State = {
  highlights: Measurement[]
  doSearch: boolean
  term: string
}

const Highlight = view(UI.View, {
  position: 'absolute',
  background: 'yellow',
  borderRadius: 4,
  opacity: 0.6,
})

export class HighlightsLayer extends React.Component<Props, State> {
  frameRef = React.createRef<HTMLDivElement>()

  state = {
    term: '',
    highlights: [],
    doSearch: false,
  }

  static getDerivedStateFromProps(props, state) {
    if (props.term !== state.term) {
      return {
        term: props.term,
        doSearch: true,
      }
    }
  }

  componentDidUpdate() {
    if (this.state.doSearch) {
      this.doSearch()
    }
  }

  doSearch() {
    if (this.props.term.length < 3) {
      this.setState({
        highlights: [],
        doSearch: false,
      })
      return
    }
    const rootNode = findDOMNode(this) as Element
    const searchableNodes: HTMLElement[] = Array.from(
      rootNode.querySelectorAll('.searchable-item, .searchable > *'),
    )
    const { term } = this.props
    const range = document.createRange()
    const highlights = []
    const frameBounds = this.frameRef.current.getBoundingClientRect() as DOMRect
    this.getHighlights(highlights, searchableNodes, term, range, frameBounds)
    this.setState({
      highlights,
      doSearch: false,
    })
  }

  getHighlights(
    highlights: Measurement[],
    searchableNodes: Node[],
    term: string,
    range: Range,
    frameBounds: DOMRect,
  ) {
    const hasTerm = (text = '', term = '') =>
      text.toLowerCase().indexOf(term) >= 0
    for (const node of searchableNodes) {
      if (!hasTerm(node.textContent, term)) {
        continue
      }
      // not a text node, keep going...
      if (node.nodeType !== Node.TEXT_NODE) {
        if (node.childNodes) {
          this.getHighlights(
            highlights,
            Array.from(node.childNodes),
            term,
            range,
            frameBounds,
          )
        }
        continue
      }
      if (!hasTerm(node.textContent, term)) {
        continue
      }
      range.selectNode(node)
      console.log('found', node, range.getBoundingClientRect())
      const textRect = range.getBoundingClientRect() as DOMRect
      const highlight = {
        x: textRect.x - frameBounds.x,
        y: textRect.y - frameBounds.y,
        width: textRect.width,
        height: textRect.height,
      }
      highlights.push(highlight)
    }
  }

  render() {
    const { highlights } = this.state
    return (
      <UI.View position="relative">
        <UI.FullScreen forwardRef={this.frameRef} pointerEvents="none">
          {highlights.map(({ x, y, width, height }, index) => {
            return (
              <Highlight
                key={index}
                top={y}
                left={x}
                width={width}
                height={height}
              />
            )
          })}
        </UI.FullScreen>
        {this.props.children}
      </UI.View>
    )
  }
}
