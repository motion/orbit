import * as UI from '@o/ui'
import { gloss } from 'gloss'
import * as React from 'react'
import { findDOMNode } from 'react-dom'

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

const Highlight = gloss(UI.View, {
  position: 'absolute',
  background: 'yellow',
  borderRadius: 4,
  padding: 2,
  transform: {
    y: -0.5,
    x: -0.5,
  },
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
    return null
  }

  componentDidMount() {
    this.doSearch()
  }

  inputFocus() {
    this.doSearch()
  }

  doSearch() {
    if (!this.state.doSearch || !this.frameRef.current) {
      return
    }
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
    if (!range) {
      throw new Error('No range')
    }
    const hasTerm = (text = '', term = '') => text.toLowerCase().indexOf(term) >= 0
    for (const node of searchableNodes) {
      if (!hasTerm(node.textContent, term)) {
        continue
      }
      // not a text node, keep going...
      if (node.nodeType !== Node.TEXT_NODE) {
        if (node.childNodes) {
          this.getHighlights(highlights, Array.from(node.childNodes), term, range, frameBounds)
        }
        continue
      }
      if (!hasTerm(node.textContent, term)) {
        continue
      }
      range.selectNode(node)
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
        <UI.FullScreen ref={this.frameRef} pointerEvents="none" zIndex={-1}>
          {highlights.map(({ x, y, width, height }, index) => {
            return (
              <Highlight
                key={index}
                top={y}
                left={x}
                width={width}
                height={height}
                className="highlight"
              />
            )
          })}
        </UI.FullScreen>
        {this.props.children || null}
      </UI.View>
    )
  }
}
