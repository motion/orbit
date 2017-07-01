// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy } from 'lodash'
import Router from '~/router'

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

  render({ store }: Props) {
    const { docs } = store
    const hasDocs = store.newTitle !== null || (docs || []).length > 0

    const dot = color =>
      <UI.Button
        circular
        background={color}
        size={0.3}
        $$margin={[0, 5, 0, 0]}
        color={color}
      />

    const getDoc = doc => {
      const children = store.children[doc._id]
      return {
        onClick() {
          Router.go(doc.url())
        },
        primary: (
          <div $$row $$align="center">
            <name>
              {dot(doc.color)}
              <span $$ellipse>
                {doc.getTitle()}
              </span>
            </name>
          </div>
        ),
        secondary: (
          <content if={children}>
            {children.map(child =>
              <child key={child._id}>
                {child.getTitle()}
              </child>
            )}
          </content>
        ),
      }
    }
    const newDoc =
      store.newTitle === null
        ? null
        : {
            primary: (
              <div $$row $$align="center">
                <name>
                  {dot([0, 0, 0, 0.4])}
                  <input
                    $name
                    autoFocus
                    value={store.newTitle}
                    onKeyDown={e => e.which === 13 && store.create()}
                    onChange={e => (store.newTitle = e.target.value)}
                    onBlur={e => (store.newTitle = null)}
                  />
                </name>
              </div>
            ),
          }

    const items = [
      ...sortBy(docs || [], 'createdAt').map(getDoc),
      ...(newDoc ? [newDoc] : []),
    ]

    return (
      <children>
        <header $$row>
          <title>
            {hasDocs ? '' : 'No '}Pages
          </title>
          <actions>
            <UI.Button
              $add
              if={store.newTitle === null}
              size={1}
              icon="siadd"
              onClick={store.add}
            />
          </actions>
        </header>
        <content>
          <UI.List if={hasDocs} items={items} />
        </content>
      </children>
    )
  }

  static style = {
    children: {
      // borderTop: [1, '#f6f6f6'],
      padding: [5],
      cursor: 'default',
      width: 170,
    },
    header: {
      padding: [0, 10],
      justifyContent: 'space-between',
    },
    title: {
      textTransform: 'uppercase',
      fontSize: 12,
      color: [0, 0, 0, 0.3],
      margin: [7, 0, 10, 0],
      fontWeight: 500,
    },
    content: {
      // padding: [0, 2],
    },
    noDocs: {
      padding: 20,
      alignSelf: 'center',
      textAlign: 'center',
    },
    child: {
      marginLeft: 20,
      color: [0, 0, 0, 0.5],
    },
    empty: {
      padding: 20,
      justifyContent: 'center',
      alignSelf: 'center',
      fontSize: 16,
      color: 'rgba(0,0,0,.6)',
    },
    input: {
      border: 'none',
      width: '100%',
      padding: 0,
      background: 'transparent',
      fontSize: 14,
    },
    name: {
      fontWeight: 500,
      fontSize: 14,
      flexFlow: 'row',
      alignItems: 'center',
      borderBottom: [2, 'transparent'],
      '&:hover': {
        borderBottomColor: '#eee',
      },
    },
  }
}
