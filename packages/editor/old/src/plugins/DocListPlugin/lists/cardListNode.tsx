import { view } from '@o/black'
import * as UI from '@o/ui'
import React from 'react'
import FlipMove from 'react-flip-move'
import DocItem from '~/views/document/item'

const width = 250
const height = 280

@view
export default class CardList {
  docRef = (node, index) => {
    if (this.props.shouldFocus && node && index === 0) {
      node.focus()
      this.props.listStore.doneFocusing()
    }
  }

  render({ listStore }) {
    const hasDocs = listStore.docs && listStore.docs.length > 0
    return (
      <cardList>
        <UI.Button if={!hasDocs} icon="simple-add" onClick={listStore.createDoc}>
          create document
        </UI.Button>

        <docs if={hasDocs}>
          <FlipMove $docs duration={300} easing="ease-out">
            {listStore.docs.map((doc, i) => (
              <UI.TiltGlow width={width} height={height} key={doc._id}>
                <DocItem inline ref={node => this.docRef(node, i)} doc={doc} />
              </UI.TiltGlow>
            ))}
          </FlipMove>
        </docs>
      </cardList>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      padding: 10,
      margin: [0, -40, 0, 0],
      flexWrap: 'wrap',
    },
  }
}
