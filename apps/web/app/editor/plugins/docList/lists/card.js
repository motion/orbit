import React from 'react'
import { view } from '~/helpers'
import { Icon } from '~/ui'
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
        <doc $temp $$centered onClick={listStore.createDoc}>
          <Icon name="uiadd" />
        </doc>
        {(listStore.docs || [])
          .map((doc, i) => (
            <DocItem
              $doc
              bordered
              inline
              key={doc._id}
              ref={node => this.docRef(node, i)}
              doc={doc}
            />
          ))}
      </docs>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      padding: 10,
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
    temp: {
      background: '#fafafa',
      cursor: 'pointer',
      width: 40,
      '&:hover': {
        background: '#f2f2f2',
      },
    },
    row: {
      flexFlow: 'row',
      overflowX: 'scroll',
    },
  }
}
