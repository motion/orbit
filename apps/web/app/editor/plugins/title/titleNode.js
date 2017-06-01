import React from 'react'
import { view } from '~/helpers'
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
      fontSize: 14,
      textTransform: 'uppercase',
      color: [0, 0, 0, 0.5],
      marginBottom: 5,
    },
  }
}
