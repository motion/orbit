import React from 'react'
import { view } from '@jot/black'
import node from '~/editor/node'

@node
@view.ui
export default class TitleNode {
  render({ editorStore, children, node, attributes, ...props }) {
    const level = node.data.get('level')
    const Tag = props => React.createElement(`h${level}`, props)

    return (
      <Tag
        $title={level}
        $title1={level === 1}
        $$style={editorStore.theme.title}
        $inline={editorStore.inline}
        className="Tilt-inner"
        {...attributes}
      >
        {children}
      </Tag>
    )
  }

  static style = {
    title: level => ({
      fontWeight: level < 5 ? 400 : 600,
      fontSize: Math.floor(Math.log(200 / level) * 5.5),
    }),
    title1: {
      fontSize: 19,
      fontWeight: 1900,
      color: [0, 0, 0, 0.9],
      marginBottom: 5,
    },
    inline: {
      // fontFamily: 'Abril Fatface',
      fontFamily: '"Whitney SSm A", "Whitney SSm B", Helvetica, Arial',
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#eee',
    },
  }
}
