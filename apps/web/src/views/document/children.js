// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Models from '@mcro/models'
import { sortBy } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'
import RightArrow from '~/views/kit/rightArrow'
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

const ICONS = {
  inbox: 'paper',
  thread: 'chat46',
}

@view.ui
class Item {
  render({ doc, editable, onSave, textRef, subItems, children, ...props }) {
    return (
      <doccontainer
        $$undraggable
        onClick={() => doc.url && Router.go(doc.url())}
        {...props}
      >
        <UI.Surface
          icon={ICONS[doc.type]}
          iconProps={{
            css: {
              alignSelf: 'flex-start',
              marginTop: 3,
            },
          }}
          align="center"
          justify="flex-end"
          flexFlow="row"
          iconAfter
          textAlign="right"
          padding={[4, 0, 10]}
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

        <subitems if={children}>
          {children}
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
      lineHeight: '1.1rem',
      width: '100%',
      color: '#000',
    },
  }
}

const SortableItem = SortableElement(props =>
  <Item style={{ zIndex: 1000000 }} {...props} />
)

class ChildrenStore {
  version = 1
  creatingDoc = false
  showBrowse = false

  get document() {
    return this.props.explorerStore.document
  }

  @watch
  children = () => this.version && this.document && this.document.getChildren()

  @watch
  newDoc = () =>
    this.creatingDoc && this.document
      ? Models[this.docType].createTemporary({
          parentId: this.document.id,
          parentIds: [this.document.id],
        })
      : null

  get docsById(): Object {
    return (
      this.children &&
      this.children.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    )
  }

  get sortedDocs() {
    const recentDocs = sortBy(this.children || [], 'createdAt').reverse()
    if (
      this.children &&
      this.document &&
      this.document.childrenSort &&
      this.document.childrenSort.length
    ) {
      const final = this.document.childrenSort.map(id => this.docsById[id])
      if (this.children.length > final.length) {
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

  get hasDocs() {
    return this.children && this.children.length
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const sortedChildren = arrayMove(
      this.sortedDocs.map(doc => doc && doc.id),
      oldIndex,
      newIndex
    )
    this.document.childrenSort = sortedChildren
    this.document.save()
  }

  createDoc = () => {
    this.docType = 'Document'
    this.creatingDoc = true
  }

  createInbox = () => {
    this.docType = 'Inbox'
    this.creatingDoc = true
  }

  saveCreatingDoc = async title => {
    this.newDoc.setDefaultContent({ title })
    await this.newDoc.save()
    this.version++
    this.creatingDoc = false
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
  store: ChildrenStore,
})
export default class Children {
  props: Props

  onNewItemText = ref => {
    if (ref) {
      ref.focus()
    }
  }

  render({ explorerStore, store, store: { hasDocs, sortedDocs } }: Props) {
    return (
      <children>
        <title $$row $$centered $$marginBottom={10}>
          <UI.Title fontWeight={200} color={[0, 0, 0, 0.4]}>
            Pages
          </UI.Title>

          <UI.Popover
            openOnClick
            closeOnClick
            towards="right"
            target={
              <UI.Button marginLeft={10} circular size={0.8} icon="add" />
            }
          >
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
                onClick={store.createInbox}
                icon="paper"
                tooltip="create inbox"
                tooltipProps={{
                  towards: 'top',
                }}
              />
              <slant css={{ borderRight: [1, '#ccc'], height: '100%' }} />
              <UI.Button
                tooltip="create page"
                onClick={store.createDoc}
                icon="filesg"
                tooltipProps={{
                  towards: 'top',
                }}
              />
            </UI.Segment>
          </UI.Popover>
        </title>

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
        <UI.Button
          onClick={explorerStore.ref('showBrowse').toggle}
          css={{ position: 'relative', zIndex: 100 }}
        >
          Browse
        </UI.Button>
        <fade $bottom />
      </children>
    )
  }

  static style = {
    children: {
      padding: [10, 18],
      width: '100%',
      flex: 1,
      alignItems: 'flex-end',
      position: 'relative',
      pointerEvents: 'auto',
    },
    contents: {
      marginRight: 5,
      paddingBottom: 20,
      flex: 1,
      overflowY: 'scroll',
      overflowX: 'visible',
    },
    fade: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 50,
      zIndex: 10,
      pointerEvents: 'none',
    },
    bottom: {
      bottom: 0,
      background: 'linear-gradient(transparent, #fff)',
    },
  }
}
