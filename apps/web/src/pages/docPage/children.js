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
  <UI.Icon
    $$undraggable
    onMouseDown={e => e.stopPropagation() && e.preventDefault()}
    name="menu"
    size={8}
    opacity={0.25}
    {...props}
  />
)

@view.ui
class Item {
  render({ doc, editable, onSave, textRef, subItems, ...props }) {
    return (
      <doccontainer
        $$undraggable
        onClick={() => doc.url && Router.go(doc.url())}
        {...props}
      >
        <UI.Surface
          icon={doc.type === 'thread' ? 'chat46' : null}
          iconProps={{
            css: {
              alignSelf: 'flex-start',
              marginTop: 6,
            },
          }}
          align="center"
          justify="flex-end"
          flexFlow="row"
          iconAfter
          textAlign="right"
          padding={[4, 8]}
        >
          <UI.Text
            $title
            if={doc.title || editable}
            editable={editable}
            onFinishEdit={onSave}
            ref={textRef}
          >
            {doc.title}
          </UI.Text>
        </UI.Surface>

        <subitems if={false}>
          {(subItems &&
            subItems.length &&
            <subdocs>
              <RightArrow $arrow css={{ transform: { scale: 0.5 } }} />
              {subItems.map(child =>
                <UI.Text
                  if={child}
                  key={child.id}
                  onClick={() => Router.go(child.url())}
                  size={0.8}
                >
                  {child.title}
                </UI.Text>
              )}
            </subdocs>) ||
            null}
        </subitems>
        <DragHandle
          if={false}
          css={{ position: 'absolute', top: 11, right: -10, cursor: 'move' }}
        />
      </doccontainer>
    )
  }
  static style = {
    doccontainer: {
      minWidth: 50,
      position: 'relative',
      opacity: 0.8,
      transition: 'transform ease-in 50ms',
      transform: {
        scale: 1,
      },
      '&:hover': {
        opacity: 1,
        transform: {
          scale: 1.03,
          x: -2,
        },
      },
    },
    icon: {
      padding: [5, 0, 0],
    },
    title: {
      fontWeight: 300,
      fontSize: 16,
      lineHeight: '1.2rem',
      width: '100%',
      color: '#000',
    },
  }
}

const SortableItem = SortableElement(props =>
  <Item style={{ zIndex: 1000000 }} {...props} />
)

class ExplorerChildrenStore {
  children = {}
  version = 1

  get document() {
    return this.props.explorerStore.document
  }

  lastDocs = null // temp until queries returning blank for a frame is fixed

  @watch
  docs = ({ explorerStore: { document } }) =>
    this.version && document && document.getChildren && document.getChildren()

  creatingDoc = false
  @watch
  newDoc = () =>
    this.creatingDoc && this.props.explorerStore.document
      ? Document.createTemporary({
          parentId: this.props.explorerStore.document.id,
          parentIds: [this.props.explorerStore.document.id],
          type: this.docType,
        })
      : null

  get docsById(): Object {
    return (
      this.docs &&
      this.docs.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    )
  }

  get sortedDocs() {
    const recentDocs = sortBy(this.docs || [], 'createdAt').reverse()

    if (
      this.docs &&
      this.document &&
      this.document.childrenSort &&
      this.document.childrenSort.length
    ) {
      const final = this.document.childrenSort.map(id => this.docsById[id])

      if (this.docs.length > final.length) {
        for (const doc of recentDocs) {
          if (!final.find(x => x.id === doc.id)) {
            final.push(doc)
          }
        }
      }

      return final
    }
    return recentDocs
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const sortedChildren = arrayMove(
      this.sortedDocs.map(doc => doc && doc.id),
      oldIndex,
      newIndex
    )
    log(sortedChildren)
    this.document.childrenSort = sortedChildren
    this.document.save()
  }

  get hasDocs() {
    return this.docs && this.docs.length
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
              id: doc.id,
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

  createDoc = () => {
    this.docType = 'document'
    this.creatingDoc = true
  }

  createThread = () => {
    this.docType = 'thread'
    this.creatingDoc = true
  }

  saveCreatingDoc = async title => {
    this.newDoc.title = title
    this.newDoc.type = this.docType
    await this.newDoc.save()
    log('saved', this.newDoc.id)
    this.version++
    this.creatingDoc = false
    // this.setTimeout(() => {

    // }, 500)
  }
}

const SortableChildren = SortableContainer(({ items, store }) =>
  <docs $$undraggable>
    {items.map(doc => {
      if (!doc) {
        return null
      }
      const subItems = store.children[doc.id]
      return <SortableItem key={doc.id} doc={doc} subItems={subItems} />
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

  render({ store, store: { hasDocs, sortedDocs } }: Props) {
    return (
      <children>
        <UI.Title if={false} css={{ padding: [0, 10, 5] }}>
          Children
        </UI.Title>
        <UI.Segment
          chromeless
          css={{
            paddingBottom: 5,
          }}
          itemProps={{
            chromeless: true,
            iconAfter: true,
            size: 0.9,
            color: [0, 0, 0, 0.2],
            hoverColor: [0, 0, 0, 0.6],
          }}
        >
          <UI.Button
            onClick={store.createThread}
            icon="chat46"
            tooltip="create inbox"
            tooltipProps={{
              towards: 'left',
            }}
          />
          <slant css={{ borderRight: [1, '#ccc'], height: '100%' }} />
          <UI.Button
            tooltip="create page"
            onClick={store.createDoc}
            icon="filesg"
            tooltipProps={{
              towards: 'right',
            }}
          />
        </UI.Segment>

        <contents>
          <Item
            if={store.newDoc}
            editable
            onSave={store.saveCreatingDoc}
            doc={store.newDoc}
            textRef={this.onNewItemText}
          />
          <SortableChildren
            if={hasDocs}
            items={sortedDocs}
            store={store}
            onSortEnd={store.onSortEnd}
            pressDelay={500}
          />
        </contents>

        <shadow if={false} $glow />
        <background $glow />
        <fade $bottom />
      </children>
    )
  }

  static style = {
    children: {
      padding: 10,
      width: '100%',
      flex: 1,
      alignItems: 'flex-end',
      position: 'relative',
    },
    contents: {
      width: '100%',
      flex: 1,
      overflowY: 'scroll',
      overflowX: 'visible',
    },
    arrow: {
      height: 20,
      margin: ['auto', 0],
    },
    subdocs: {
      flexFlow: 'row',
      justifyContent: 'flex-end',
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
    fade: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 50,
      zIndex: 10000000,
      pointerEvents: 'none',
    },
    bottom: {
      bottom: 0,
      background: 'linear-gradient(transparent, #fff)',
    },
  }
}
