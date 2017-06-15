import React from 'react'
import { view } from '@jot/black'
import { Glow, Icon, Button } from '~/ui'
import Tilt from 'react-tilt'
import DocItem from '~/views/document/item'
import FlipMove from 'react-flip-move'
import { sortBy } from 'lodash'
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
        <Button if={!hasDocs} icon="simple-add" onClick={listStore.createDoc}>
          create document
        </Button>

        {/* until we get recent working */}
        {sortBy(listStore.docs || [], 'createdAt').reverse().map((doc, i) => (
          <Tilt
            key={doc._id}
            options={{
              max: 10,
              perspective: 1000,
              reverse: true,
              scale: 1,
            }}
          >
            <doc>
              <DocItem
                $doc
                readOnly
                inline
                ref={node => this.docRef(node, i)}
                doc={doc}
              />
              <Glow
                key={`glow-${doc._id}`}
                full
                scale={1.8}
                resist={-10}
                color={[255, 255, 255]}
                zIndex={1000}
                opacity={0.3}
              />
            </doc>
          </Tilt>
        ))}
      </FlipMove>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      padding: 10,
      margin: [0, -40, 0, 0],
    },
    doc: {
      overflow: 'hidden',
      margin: [0, 10, 0, 0],
      cursor: 'default',
      width,
      height,
      borderRadius: 5,
      transition: 'transform 50ms ease-in',
      boxShadow: [0, 0, 0, [0, 0, 0, 0.2]],
    },
  }
}
