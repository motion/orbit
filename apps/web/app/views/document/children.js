// @flow
import React from 'react'
import { view } from '@jot/black'
import { Button, TiltGlow } from '~/ui'
import { Document } from '@jot/models'

const WIDTH = 50
const HEIGHT = 50

type Props = {
  id: number,
  store: object,
}

@view({
  store: class ChildrenStore {
    docs = Document.child(this.props.id)
    newTitle = null

    add = () => {
      this.newTitle = ''
    }

    create = async () => {
      const { id } = this.props
      await Document.create({ parentId: id, title: this.newTitle })
      this.newTitle = null
    }
  },
})
export default class Children {
  props: Props

  render({ id, store }: Props) {
    const { docs } = store

    const hasDocs = store.newTitle !== null || (docs || []).length > 0

    return (
      <children $$row>
        <bar if={!hasDocs}>
          <Button if={store.newTitle === null} icon="siadd" onClick={store.add}>
            add document
          </Button>
        </bar>

        <docBar $$row if={hasDocs}>
          <docs>
            {(docs || []).map(doc =>
              <doc key={doc._id} onClick={() => Router.go(doc.url())}>
                <TiltGlow width={WIDTH} height={HEIGHT}>
                  <box />
                </TiltGlow>
                <name>{doc.getTitle()}</name>
              </doc>
            )}
            <doc if={store.newTitle !== null}>
              <TiltGlow width={WIDTH} height={HEIGHT}>
                <box />
              </TiltGlow>
              <input
                $name
                autoFocus
                value={store.newTitle}
                onKeyDown={e => e.which === 13 && store.create()}
                onChange={e => (store.newTitle = e.target.value)}
              />
            </doc>
          </docs>
          <Button
            if={store.newTitle === null}
            circular
            iconSize={20}
            size={50}
            $circleButton
            icon="siadd"
            onClick={store.add}
          />
        </docBar>
      </children>
    )
  }

  static style = {
    children: {
      borderTop: '1px dotted #eee',
    },
    box: {
      width: WIDTH,
      height: HEIGHT,
      border: '1px solid #999',
      background: '#ccc',
    },

    doc: {
      marginRight: 20,
      alignItems: 'center',
    },
    bar: {
      padding: [5, 10],
    },

    docBar: {
      alignItems: 'center',
      padding: [15, 20],
    },

    docs: {
      flexFlow: 'row',
    },

    input: {
      width: 100,
    },

    name: {
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 12,
      marginTop: 10,
    },
  }
}
