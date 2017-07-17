import React from 'react'
import { view } from '@mcro/black'
import node from '~/editor/node'

@node
@view.ui
export default class TitleNode {
  state = {
    shown: false,
  }

  componentDidMount() {
    if (this.props.node.data.get('level') === 1) {
      this.setTimeout(() => {
        this.setState({
          shown: true,
        })
      })
    }
  }

  render({ editorStore, children, node, attributes, ...props }) {
    const level = node.data.get('level')

    if (editorStore.props.noTitle) {
      return <notitle contentEditable={false} />
    }

    return (
      <tag
        tagName={`h${level}`}
        $title={level}
        $title1={level === 1}
        $$style={editorStore.theme.title}
        $inline={editorStore.inline}
        $shown={this.state.shown}
        {...attributes}
      >
        {children}
      </tag>
    )
  }

  static style = {
    tag: {
      position: 'sticky',
    },
    title: level => ({
      fontWeight: level < 5 ? 400 : 600,
      fontSize: Math.floor(Math.log(200 / level) * 5.5),
    }),
    title1: {
      fontSize: 20,
      height: 50,
      fontWeight: 800,
      color: [0, 0, 0, 0.95],
      margin: [16, 0, -10],
    },
    inline: {
      // fontFamily: 'Abril Fatface',
      fontFamily: '"Whitney SSm A", "Whitney SSm B", Helvetica, Arial',
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.2,
      // color: '#eee',
    },
  }
}
