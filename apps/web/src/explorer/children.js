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

@view.ui
class Item {
  render({ editable, children, title, onSave, textRef, ...props }) {
    return (
      <doccontainer {...props}>
        <UI.TiltGlow
          css={{
            border: [1, '#eee'],
          }}
          width={160}
          height={60}
        >
          <doc $$justify="flex-start">
            <UI.Text
              $title
              if={title || editable}
              editable={editable}
              onFinishEdit={onSave}
              ref={textRef}
            >
              {title}
            </UI.Text>
            {children}
          </doc>
        </UI.TiltGlow>
      </doccontainer>
    )
  }
  static style = {
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
  }
}

class ExplorerChildrenStore {
  children = {}
  version = 1

  lastDocs = null // temp until queries returning blank for a frame is fixed

  @watch
  docs = ({ explorerStore: { document } }) =>
    this.version && document && document.getChildren && document.getChildren()

  creatingDoc = false
  @watch
  newDoc = () =>
    this.creatingDoc && this.props.explorerStore.document
      ? Document.create(
          {
            parentId: this.props.explorerStore.document._id,
            parentIds: [this.props.explorerStore.document._id],
          },
          true
        )
      : null

  get allDocs() {
    let { docs, lastDocs } = this
    if ((!docs || !docs.length) && lastDocs) {
      return lastDocs
    }
    const result = sortBy(docs || [], 'createdAt')
    return result
  }

  get hasDocs() {
    return this.allDocs.length
  }

  start() {
    this.watch(() => {
      if (this.docs && this.docs.length) {
        this.lastDocs = this.docs
      }
    })

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

  saveCreatingDoc = async title => {
    log('save new child, title:', title)
    this.newDoc.title = title
    await this.newDoc.save()
    console.log('got em', this.newDoc)
    this.creatingDoc = false
    this.version++
  }
}

@view.attach('explorerStore')
@view({
  store: ExplorerChildrenStore,
})
export default class ExplorerChildren {
  props: Props

  onNewItemText = ref => {
    if (ref) {
      ref.focus()
    }
  }

  render({ store, store: { hasDocs, allDocs } }: Props) {
    log('NOW2', allDocs)
    return (
      <children>
        <FlipMove
          if={hasDocs && Object.keys(store.children).length}
          duration={300}
          easing="ease-out"
        >
          {allDocs.map(doc => {
            const children = store.children[doc._id]
            return (
              <Item
                key={doc._id}
                onClick={() => Router.go(doc.url())}
                title={doc.title}
              >
                <subdocs if={children && children.length}>
                  <Arrow $arrow />
                  {children.map(child =>
                    <UI.Button
                      chromeless
                      key={child._id}
                      onClick={() => Router.go(child.url())}
                    >
                      {child.title}
                    </UI.Button>
                  )}
                </subdocs>
              </Item>
            )
          })}
        </FlipMove>
        <Item
          if={store.creatingDoc}
          editable
          onSave={store.saveCreatingDoc}
          textRef={this.onNewItemText}
        />
        <Item onClick={store.ref('creatingDoc').setter(true)} title="Create" />
      </children>
    )
  }

  static style = {
    children: {
      width: 180,
      paddingLeft: 20,
      overflow: 'hidden',
      marginTop: 135,
      transform: {
        x: 54,
      },
      padding: [10, 0],
      // borderTop: [1, '#eee', 'dotted'],
      flex: 1,
      transition: 'transform ease-in 200ms',
      '&:hover': {
        transform: {
          x: 50,
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
    subdocs: {
      flexFlow: 'row',
      overflow: 'hidden',
    },
    text: {
      lineHeight: '1.4rem',
    },
  }
}
