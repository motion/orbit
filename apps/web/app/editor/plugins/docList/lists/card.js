import React from 'react'
import { view } from '~/helpers'
import { Glow, Icon } from '~/ui'
import Tilt from 'react-tilt'
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
          <Tilt key={doc._id} options={{ max: 25 }}>
            <DocItem
              $doc
              bordered
              inline
              ref={node => this.docRef(node, i)}
              doc={doc}
            />
          </Tilt>
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
      width: 300,
      height: 280,
      borderRadius: 5,
      overflow: 'hidden',
      transition: 'transform 50ms ease-in',
    },
  }
}
