// @flow
import React from 'react'
import { view } from '@jot/black'
import { Button, TiltGlow } from '~/ui'
import { Document } from '@jot/models'
import { sortBy } from 'lodash'
import Router from '~/router'

const WIDTH = 100
const HEIGHT = 120

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
      <children>
        <header>
          <title>Pages</title>
          <actions>
            <Button
              $add
              if={store.newTitle === null}
              circular
              size={2}
              icon="siadd"
              onClick={store.add}
            />
          </actions>
        </header>
        <content>
          <docs if={hasDocs}>
            {sortBy(docs || [], 'createdAt').map(doc => {
              const children = store.children[doc._id]
              return (
                <doc key={doc._id} onClick={() => Router.go(doc.url())}>
                  <TiltGlow width={WIDTH} height={HEIGHT}>
                    <card
                      $$style={{
                        background: doc.color,
                      }}
                    >
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
        </content>
      </children>
    )
  }

  static style = {
    children: {
      borderTop: [1, '#f6f6f6'],
      position: 'relative',
      padding: [8, 0, 4],
    },
    header: {
      padding: [0, 10],
    },
    title: {
      textTransform: 'uppercase',
      fontSize: 12,
      color: [0, 0, 0, 0.3],
      fontWeight: 500,
    },
    actions: {
      position: 'absolute',
      top: -10,
      right: 10,
      zIndex: 1000,
    },
    content: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [10, 20],
      overflowX: 'scroll',
      overflowY: 'visible',
    },
    docs: {
      flexFlow: 'row',
    },
    doc: {
      marginRight: 12,
    },
    card: {
      width: WIDTH,
      height: HEIGHT,
      color: '#fff',
      background: '#fff',
      // border: [1, '#eee'],
      borderRadius: 7,
      padding: [16, 12],
    },
    bar: {
      padding: [5, 10],
    },
    input: {
      width: 100,
    },
    name: {
      fontWeight: 200,
      fontSize: 16,
    },
  }
}
