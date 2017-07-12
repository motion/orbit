// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy, sum } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'
import Arrow from './arrow'
import FlipMove from 'react-flip-move'

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
      <children>
        <actions if={false}>
          <post $$row $$centered if={false}>
            <UI.Button
              if={store.newTitle === null}
              size={1}
              icon="siadd"
              circular
              size={1.2}
              elevation={1}
              onClick={store.add}
              borderWidth={0}
            />
          </post>
        </actions>
        <UI.StableContainer stableDuration={500}>
          <FlipMove
            if={hasDocs && Object.keys(store.children).length}
            duration={300}
            easing="ease-out"
          >
            {allDocs.map(doc => {
              const children = store.children[doc._id]
              return (
                <doccontainer>
                  <UI.TiltGlow
                    if={doc.title}
                    width={160}
                    height={60}
                    key={doc._id}
                    css={{
                      border: [1, '#eee'],
                    }}
                    onClick={() => Router.go(doc.url())}
                  >
                    <doc justify="flex-start">
                      <title>
                        {doc.getTitle()}
                      </title>
                      <subdocs if={children && children.length}>
                        <Arrow $arrow />
                        {children.map(child =>
                          <UI.Button
                            chromeless
                            key={child._id}
                            onClick={() => Router.go(child.url())}
                          >
                            {child.getTitle()}
                          </UI.Button>
                        )}
                      </subdocs>
                    </doc>
                  </UI.TiltGlow>
                </doccontainer>
              )
            })}
          </FlipMove>
        </UI.StableContainer>
        <doccontainer>
          <UI.TiltGlow width={160} height={60}>
            <doc $$justify="flex-start">
              <title>+</title>
            </doc>
          </UI.TiltGlow>
        </doccontainer>
      </children>
    )
  }

  static style = {
    children: {
      width: 200,
      marginTop: 135,
      transform: {
        x: 24,
      },
      padding: [10, 0],
      // borderTop: [1, '#eee', 'dotted'],
      flex: 1,
      transition: 'transform ease-in 200ms',
      '&:hover': {
        transform: {
          x: 20,
        },
      },
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
    arrow: {
      height: 20,
      margin: ['auto', 0],
    },
    post: {
      marginTop: -20,
    },
    paths: {
      flexFlow: 'row',
    },
    doccontainer: {
      marginBottom: 10,
      position: 'relative',
    },
    doc: {
      height: '100%',
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
      margin: 0,
      padding: 0,
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '22px',
      color: '#555',
    },
    subdocs: {
      flexFlow: 'row',
      overflow: 'hidden',
    },
    text: {
      lineHeight: '1.4rem',
    },
  }
}
