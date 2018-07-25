import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

type Props = {
  term: string
}

const Highlight = view(UI.View, {
  background: 'yellow',
  borderRadius: 4,
  opacity: 0.6,
})

export class HighlightsLayer extends React.Component<Props> {
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
    let highlights = []
    const rootNode = findDOMNode(this) as Element
    const searchableNodes: HTMLElement[] = [].slice.call(
      rootNode.querySelectorAll('.searchable'),
    )
    const { term } = this.props
    const range = document.createRange()
    for (const node of searchableNodes) {
      if (node.innerText.toLowerCase().indexOf(term) >= 0) {
        for (const textNode of [].slice.call(node.childNodes)) {
          if (textNode.nodeType != Node.TEXT_NODE) {
            console.log(textNode, 'invalid children, we could traverse down...')
            continue
          }
          range.selectNode(textNode)
          highlights.push(range.getBoundingClientRect())
        }
      }
    }
    this.setState({
      highlights,
      doSearch: false,
    })
  }

  render() {
    const { highlights } = this.state
    return (
      <UI.View position="relative">
        <UI.FullScreen>
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
