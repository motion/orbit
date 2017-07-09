// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'
import Arrow from './arrow'

type Props = {
  id: number,
  store: object,
}

class ExplorerChildrenStore {
  children = {}
  @watch
  docs = ({ explorerStore: { document } }) =>
    document &&
    typeof document.getChildren === 'function' &&
    document.getChildren()
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
    const { docs } = store
    const hasDocs = store.newTitle !== null || (docs || []).length > 0
    const allDocs = sortBy(docs || [], 'createdAt')

    return (
      <children $$opacity={0.5}>
        <actions if={false}>
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
              <doc if={doc.title} justify="flex-start" key={index}>
                <title>
                  <UI.Button
                    $subDocItem
                    chromeless
                    onClick={() => Router.go(doc.url())}
                  >
                    {doc.getTitle()}
                  </UI.Button>
                </title>
                <subdocs if={children && children.length}>
                  <Arrow />
                  {children.map(child =>
                    <UI.Button
                      $subDocItem
                      chromeless
                      key={child._id}
                      onClick={() => Router.go(child.url())}
                    >
                      {child.getTitle()}
                    </UI.Button>
                  )}
                </subdocs>
              </doc>
            )
          })}
        </docs>
      </children>
    )
  }

  static style = {
    children: {
      // position: 'fixed',
      // bottom: 0,
      // left: 0,
      // right: 0,
      marginTop: 30,
      marginRight: -30,
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
      padding: [0, 10, 0],
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
      flex: 1,
    },
    doc: {
      flexFlow: 'row',
      borderBottom: [1, '#f2f2f2'],
      flex: 1,
      zIndex: 1,
      padding: [6, 12],
      '&:hover title': {
        color: [0, 0, 0],
      },
      '&:hover p': {
        color: [50, 50, 50],
      },
    },
    title: {
      flex: 1,
      maxWidth: '50%',
      margin: 0,
      padding: 0,
      fontWeight: 500,
      fontSize: 15,
      lineHeight: '26px',
      color: '#555',
    },
    subdocs: {
      flexFlow: 'row',
      overflow: 'hidden',
    },
    subDocItem: {
      flex: 1,
    },
    text: {
      lineHeight: '1.4rem',
    },
  }
}
