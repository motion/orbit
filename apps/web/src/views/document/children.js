// @flow
import React from 'react'
import { view } from '@jot/black'
import { Button, TiltGlow } from '@jot/ui'
import { Document } from '@jot/models'
import { sortBy } from 'lodash'
import Router from '~/router'

const WIDTH = 170
const HEIGHT = 70

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
              size={1.5}
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
                  <card>
                    <div $$row $$align="center">
                      <Button
                        circular
                        background={doc.color}
                        size={0.3}
                        $$margin={[0, 5, 0, 0]}
                        color={doc.color}
                      />
                      <name>
                        <span $$ellipse>
                          {doc.getTitle()}
                        </span>
                      </name>
                    </div>
                    <content if={children}>
                      {children.map(child =>
                        <child key={child._id}>
                          {child.getTitle()}
                        </child>
                      )}
                    </content>
                  </card>
                </doc>
              )
            })}
            <doc if={store.newTitle !== null}>
              <TiltGlow width={WIDTH}>
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
      position: 'absolute',
      top: 0,
      right: 0,
      // borderTop: [1, '#f6f6f6'],
      padding: [25, 0, 4],
    },
    header: {
      padding: [0, 0],
    },
    title: {
      textTransform: 'uppercase',
      fontSize: 12,
      color: [0, 0, 0, 0.3],
      margin: [0, 0, 10],
      fontWeight: 500,
    },
    actions: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1000,
    },
    content: {
      // padding: [0, 2],
    },
    child: {
      marginLeft: 20,
      color: [0, 0, 0, 0.5],
    },
    doc: {
      margin: [0, 0, 10],
    },
    card: {
      width: WIDTH,
      // height: HEIGHT,
      // color: '#fff',
      background: '#fff',
      // border: [1, '#eee'],
      // borderRadius: 7,
      padding: [2, 0],
    },
    bar: {
      padding: [5, 10],
    },
    input: {
      width: 100,
    },
    name: {
      fontWeight: 500,
      fontSize: 14,
      flexFlow: 'row',
      alignItems: 'center',
    },
  }
}
