import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocItem from '~/views/document/item'
import FlipMove from 'react-flip-move'

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
    const hasDocs = (listStore.docs || []).length > 0
    return (
      <FlipMove $docs duration={300} easing="ease-out">
        <UI.Button
          if={!hasDocs}
          icon="simple-add"
          onClick={listStore.createDoc}
        >
          create document
        </UI.Button>

        {listStore.docs.map((doc, i) =>
          <UI.TiltGlow width={width} height={height} key={doc._id}>
            <DocItem inline ref={node => this.docRef(node, i)} doc={doc} />
          </UI.TiltGlow>
        )}
      </FlipMove>
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
