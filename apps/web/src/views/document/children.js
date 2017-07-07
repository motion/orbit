// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy } from 'lodash'
import Router from '~/router'
import * as Commander from '~/views/commander'
import { watch } from '@mcro/black'

type Props = {
  id: number,
  store: object,
}

@view({
  store: class ChildrenStore {
    children = {}
    @watch docs = () => Document.child(this.props.id)
    newTitle = null

    start() {
      window.x = this

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
    const allDocs = sortBy(docs || [], 'createdAt')

    return (
      <children>
        <actions>
          <post $$row $$centered>
            <UI.Button marginRight={10} size={0.9} icon="down" elevation={0.25}>
              Sort
            </UI.Button>
            <UI.Button
              if={store.newTitle === null}
              size={1}
              icon="siadd"
              circular
              size={1.5}
              elevation={1}
              onClick={store.add}
              borderWidth={0}
            />
          </post>
        </actions>
        <docs if={hasDocs}>
          {allDocs.map((doc, index) => {
            const children = store.children[doc._id]

            return (
              <surface
                justify="flex-start"
                $doc
                key={index}
                onClick={() => Router.go(doc.url())}
              >
                <title $$row>
                  {doc.title}&nbsp;{' '}
                  <span $rest>Lorem ipsum dolor sit amet...</span>
                </title>
                <paths if={children}>
                  {children.map(child =>
                    <UI.Button
                      chromeless
                      key={child._id}
                      onClick={() => Router.go(child.url())}
                    >
                      {child.getTitle()}
                    </UI.Button>
                  )}
                </paths>
              </surface>
            )
          })}
        </docs>
      </children>
    )
  }

  static style = {
    actions: {
      padding: 10,
      flexFlow: 'row',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
    },
    title: {
      margin: 0,
      padding: 0,
      fontWeight: 600,
      fontSize: 18,
      lineHeight: '30px',
      color: '#555',
    },
    text: {
      lineHeight: '1.4rem',
    },
    rest: {
      color: [0, 0, 0, 0.2],
      fontSize: 14,
      fontWeight: 400,
    },
    children: {
      marginTop: 20,
      padding: 20,
      borderTopRadius: 8,
      borderTop: [1, '#eee'],
      borderRight: [1, '#eee'],
      // boxShadow: [[0, -3, 3, [0, 0, 0, 0.025]]],
      background: '#fff',
      position: 'relative',
      overflow: 'hidden',
      flex: 1,
    },
    paths: {
      flexFlow: 'row',
    },
    child: {
      fontSize: 16,
    },
    docs: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      marginRight: -12,
    },
    doc: {
      maxWidth: 300,
      minWidth: 200,
      minHeight: 100,
      flex: 1,
      margin: [0, 12, 16, 0],
      zIndex: 1,
      padding: [10, 12],
      '&:hover title': {
        color: [0, 0, 0],
      },
      '&:hover p': {
        color: [50, 50, 50],
      },
    },
  }
}
