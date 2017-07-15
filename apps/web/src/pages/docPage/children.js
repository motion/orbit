// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy, sum } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'
import RightArrow from '~/views/rightArrow'

type Props = {
  id: number,
  store: object,
}

@view.ui
class Item {
  render({ editable, children, title, onSave, textRef, ...props }) {
    return (
      <doccontainer {...props}>
        <UI.TiltGlow>
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
      position: 'relative',
    },
    doc: {
      padding: [5, 10],
      textAlign: 'right',
    },
    title: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '1.1rem',
      width: '100%',
      color: '#666',
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
      ? Document.createTemporary({
          parentId: this.props.explorerStore.document._id,
          parentIds: [this.props.explorerStore.document._id],
          type: this.docType,
        })
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
          this.docs.map(async doc => {
            return {
              id: doc._id,
              children: doc.getChildren && (await doc.getChildren()),
            }
          })
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
    this.newDoc.title = title
    await this.newDoc.save()
    this.version++
    this.creatingDoc = false
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
    return (
      <children>
        <SortableChildren
          if={hasDocs}
          items={sortedDocs || allDocs}
          store={store}
          onSortEnd={store.onSortEnd}
          pressDelay={500}
        />
        <Item
          if={store.creatingDoc}
          editable
          onSave={store.saveCreatingDoc}
          textRef={this.onNewItemText}
        />
        <UI.Popover
          openOnHover
          delay={100}
          background
          elevation={3}
          borderRadius={10}
          padding={[2, 2, 2, 3]}
          closeOnClick
          target={
            <UI.Button chromeless icon="add" marginTop={10}>
              Create
            </UI.Button>
          }
        >
          <UI.Segment itemProps={{ chromeless: true, glow: true }}>
            <UI.Button onClick={store.createDoc} icon="note">
              Document
            </UI.Button>
            <UI.Button onClick={store.createThread} icon="list">
              Thread
            </UI.Button>
          </UI.Segment>
        </UI.Popover>
        <shadow if={false} $glow />
        <background $glow />
      </children>
    )
  }

  static style = {
    children: {
      borderTop: [1, '#eee', 'dotted'],
      padding: [10, 1, 40, 0],
      flex: 1,
      '&:hover > glow': {},
      position: 'relative',
    },
    arrow: {
      height: 20,
      margin: ['auto', 0],
    },
    subdocs: {
      flexFlow: 'row',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      opacity: 0.5,
      textAlign: 'right',
    },
    text: {
      lineHeight: '1.4rem',
    },
    glow: {
      position: 'absolute',
      right: 0,
      left: 0,
      borderRadius: 1000,
    },
    shadow: {
      background: '#000',
      zIndex: 1,
      top: -35,
      bottom: 10,
      filter: 'blur(10px)',
      opacity: 0.12,
      transform: {
        x: '23%',
      },
    },
    background: {
      top: 0,
      filter: 'blur(40px)',
      bottom: 40,
      zIndex: -1,
      background: 'white',
      transform: {
        x: '20%',
      },
    },
  }
}
