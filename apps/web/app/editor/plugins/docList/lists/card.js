import React from 'react'
import { view } from '~/helpers'
import { Glow, Icon } from '~/ui'
import DocItem from '~/views/document/item'

@view
export default class CardList {
  docRef = (node, index) => {
    if (this.props.shouldFocus && node && index === 0) {
      node.focus()
      this.props.listStore.doneFocusing()
    }
  }

  render({ listStore }) {
    return (
      <docs $row>
        {(listStore.docs || []).map((doc, i) => (
          <Glow key={doc._id} full scale={0.7} color={[0, 0, 0]} opacity={1}>
            {({ translateX, translateY, glow }) => (
              <DocItem
                key={doc._id}
                $doc
                bordered
                inline
                ref={node => this.docRef(node, i)}
                doc={doc}
              >
                {glow}
              </DocItem>
            )}
          </Glow>
        ))}
      </docs>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      padding: 10,
      margin: [0, -40, 0, 0],
    },
    doc: {
      margin: [0, 10, 0, 0],
      width: 280,
      height: 280,
      borderRadius: 5,
      overflow: 'hidden',
      transition: 'transform 50ms ease-in',
      '&:active': {
        transform: { scale: 0.98 },
      },
    },
  }
}
