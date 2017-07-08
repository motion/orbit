// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'

type Props = {
  id: number,
  store: object,
}

class ExplorerChildrenStore {
  children = {}
  @watch
  docs = () =>
    this.props.explorerStore.document &&
    this.props.explorerStore.document.getChildren()
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
}

@view.attach('explorerStore')
@view({
  store: ExplorerChildrenStore,
})
export default class ExplorerChildren {
  props: Props

  render({ store }: Props) {
    console.log('saasaass', store)

    const { docs } = store
    const hasDocs = store.newTitle !== null || (docs || []).length > 0
    const allDocs = sortBy(docs || [], 'createdAt')

    return (
      <children>
        <actions>
          <UI.Title $mainTitle size={1}>
            Children
          </UI.Title>
          <post $$row $$centered>
            <UI.Button
              if={false}
              marginRight={10}
              size={0.9}
              icon="down"
              elevation={0.25}
            >
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
                if={doc.title}
                justify="flex-start"
                $doc
                key={index}
                onClick={() => Router.go(doc.url())}
              >
                <title $$row>
                  {doc.title}
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
    children: {
      marginTop: 20,
      padding: [10, 20],
      // borderTopRadius: 8,
      borderTop: [1, '#eee', 'dotted'],
      // borderRight: [1, '#eee'],
      // boxShadow: [[0, -3, 3, [0, 0, 0, 0.025]]],
      background: '#fff',
      // overflow: 'hidden',
      flex: 1,
    },
    mainTitle: {
      marginTop: 20,
    },
    actions: {
      marginTop: -20,
      padding: [0, 10, 10],
      flexFlow: 'row',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    post: {
      marginTop: -20,
    },
    paths: {
      flexFlow: 'row',
    },
    docs: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      marginRight: -12,
    },
    doc: {
      minWidth: 200,
      // minHeight: 100,
      border: [1, '#eee'],
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
    title: {
      margin: 0,
      padding: 0,
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '30px',
      color: '#555',
    },
    text: {
      lineHeight: '1.4rem',
    },
  }
}
