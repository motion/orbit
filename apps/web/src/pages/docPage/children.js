// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy, sum } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'
import RightArrow from '~/views/rightArrow'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'

type Props = {
  id: number,
  store: object,
}

const DragHandle = SortableHandle(props =>
  <UI.Icon name="menu" size={6} opacity={0.2} {...props} />
)

@view.ui
class Item {
  render({ editable, children, title, onSave, textRef, ...props }) {
    return (
      <doccontainer {...props}>
        <doc $$justify="flex-end" $$row>
          <UI.Text
            $title
            if={title || editable}
            editable={editable}
            onFinishEdit={onSave}
            ref={textRef}
          >
            {title}
          </UI.Text>
          <UI.Icon
            if={Math.random() > 0.8}
            name="paper"
            size={12}
            css={{ marginLeft: 10 }}
          />
          {children}
          <DragHandle if={false} css={{ margin: ['auto', -12, 'auto', 12] }} />
        </doc>
      </doccontainer>
    )
  }
  static style = {
    doccontainer: {
      position: 'relative',
    },
    doc: {
      padding: [5, 10],
      minWidth: 50,
      textAlign: 'right',
    },
    title: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '1.1rem',
      width: '100%',
      color: '#777',
    },
  }
}

const SortableItem = SortableElement(props =>
  <Item style={{ zIndex: 1000000 }} {...props} />
)

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

  sortedDocs = null

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.sortedDocs = arrayMove(this.allDocs, oldIndex, newIndex)
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
    this.setTimeout(() => {
      this.creatingDoc = false
      this.version++
    })
  }
}

const SortableChildren = SortableContainer(({ items, store }) =>
  <docs>
    {items.map(doc => {
      const subItems = store.children[doc._id]
      return (
        <SortableItem
          key={doc._id}
          onClick={() => Router.go(doc.url())}
          title={doc.title}
        >
          {(subItems &&
            subItems.length &&
            <subdocs>
              <RightArrow $arrow css={{ transform: { scale: 0.5 } }} />
              {subItems.map(child =>
                <UI.Text
                  key={child._id}
                  onClick={() => Router.go(child.url())}
                  size={0.8}
                >
                  {child.title}
                </UI.Text>
              )}
            </subdocs>) ||
            null}
        </SortableItem>
      )
    })}
  </docs>
)

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

  render({ store, store: { hasDocs, sortedDocs, allDocs } }: Props) {
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
          background
          elevation={3}
          borderRadius={8}
          target={
            <UI.Button icon="add" marginTop={10}>
              Create
            </UI.Button>
          }
        >
          <UI.Segment itemProps={{ chromeless: true }}>
            <UI.Button
              onClick={store.ref('creatingDoc').setter(true)}
              icon="note"
              tooltip="Document"
            />
            <UI.Button
              onClick={store.ref('creatingDoc').setter(true)}
              icon="paper"
              tooltip="Discussion"
            />
          </UI.Segment>
        </UI.Popover>

        <shadow if={false} $glow />
        <background $glow />
      </children>
    )
  }

  static style = {
    children: {
      padding: [10, 0, 40, 10],
      flex: 1,
      alignItems: 'flex-end',
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
