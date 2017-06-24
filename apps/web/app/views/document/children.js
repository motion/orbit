// @flow
import React from 'react'
import { view } from '@jot/black'
import { Button, TiltGlow } from '~/ui'
import { Document } from '@jot/models'
import { sortBy } from 'lodash'
import Router from '~/router'

const WIDTH = 200
const HEIGHT = 200

type Props = {
  id: number,
  store: object,
}

@view({
  store: class ChildrenStore {
    children = {}
    docs = Document.child(this.props.id)
    newTitle = null

    start() {
      this.watch(async () => {
        if (this.docs && this.docs.length) {
          this.children = {}
          const allChildren = await Promise.all(
            this.docs.map(async doc => ({
              id: doc._id,
              children: await doc.getChildren(),
            }))
          )
          this.children = allChildren.reduce(
            (acc, { id, children }) => ({
              ...acc,
              [id]: children,
            }),
            {}
          )
        }
      })
    }

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
            Page
          </Button>
        </bar>

        <docBar $$row if={hasDocs}>
          <docs>
            {sortBy(docs || [], 'createdAt').map(doc => {
              const children = store.children[doc._id]
              return (
                <doc key={doc._id} onClick={() => Router.go(doc.url())}>
                  <TiltGlow width={WIDTH} height={HEIGHT}>
                    <card>
                      <name>{doc.getTitle()}</name>
                      <content if={children}>
                        {children.map(child =>
                          <child key={child._id}>
                            {child.getTitle()}
                          </child>
                        )}
                      </content>
                    </card>
                  </TiltGlow>
                </doc>
              )
            })}
            <doc if={store.newTitle !== null}>
              <TiltGlow width={WIDTH} height={HEIGHT}>
                <card />
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
    card: {
      width: WIDTH,
      height: HEIGHT,
      background: 'lightblue',
      borderRadius: 10,
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
