import React from 'react'
import { view } from '~/helpers'
import node from '~/views/editor/node'
import DocList from './docList'

@node
@view
export default class HashTag {
  static plain = true

  render(props) {
    return (
      <root>
        <hashtag {...props.attributes}>
          {props.children}
        </hashtag>
        <DocList {...props} />
      </root>
    )
  }

  static style = {
    hashtag: {
      display: 'none',
      fontSize: 32,
      color: 'red',
      fontWeight: 300,
    },
    card: {
      width: 160,
      height: 200,
      background: '#fafafa',
    },
  }
}
