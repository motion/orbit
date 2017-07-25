// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Models from '~/app'
import { sortBy } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'
import Gemstone from '~/views/kit/gemstone'

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
  document: 'filesg',
}

@view.ui
class Item {
  render({
    doc,
    temporary,
    editable,
    onSave,
    textRef,
    subItems,
    children,
    ...props
  }) {
    return (
      <doccontainer
        $$undraggable
        onClick={() => {
          if (!temporary) {
            Router.go(doc.url())
          }
        }}
        {...props}
      >
        <UI.Surface
          overflow="hidden"
          background="transparent"
          icon={
            doc.type === 'document'
              ? <UI.Button
                  margin={[0, -3, 0, doc && doc.id ? -5 : 0]}
                  chromeless
                  circular
                  padding={0}
                  size={1.2}
                  glow
                >
                  <UI.Circle
                    if={doc && doc.id}
                    size={7}
                    margin={[0, 'auto']}
                    background="#ccc"
                    transform={{
                      y: -10,
                      x: -5,
                    }}
                  />
                </UI.Button>
              : ICONS[doc.type]
          }
          iconSize={30}
          iconProps={{
            css: {
              alignSelf: 'flex-start',
              transform: {
                scale: 0.3,
                y: -19,
                x: -18,
              },
              boxShadow: ['inset  0 0 100px 100px #fff'],
            },
          }}
          align="flex-start"
          justify="flex-end"
          flexFlow="row"
          iconAfter
          textAlign="right"
          padding={0}
          marginBottom={-5}
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
      marginRight: -12,
      minWidth: 80,
      position: 'relative',
      opacity: 0.8,
      // transition: 'transform ease-in 80ms',
      overflow: 'hidden',
      transform: {
        scale: 1,
        z: 0,
      },
      '&:hover': {
        opacity: 1,
        transform: {
          y: 0,
          z: 0,
          // x: -1,
          // scale: 1.03,
        },
      },
    },
    title: {
      marginBottom: 20,
      fontWeight: 300,
      fontSize: 16,
      lineHeight: '1.12rem',
      width: '100%',
      color: '#000',
      overflow: 'hidden',
    },
  }
}

const SortableItem = SortableElement(props =>
  <Item style={{ zIndex: 1000000 }} {...props} />
)

class ChildrenStore {
  version = 1
  creatingDoc = false

  get document() {
    return this.props.rootStore.document
  }

  @watch
  children = [
    () => this.document && this.document.id + this.version,
    () => this.document && this.document.getChildren(),
  ]

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
    const { children } = this
    const recentDocs = sortBy(children || [], 'createdAt').reverse()
    if (
      children &&
      this.document &&
      this.document.childrenSort &&
      this.document.childrenSort.length
    ) {
      const final = this.document.childrenSort.map(id => this.docsById[id])
      if (children.length > final.length) {
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
    const { children } = this
    return children && children.length
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
    if (title) {
      this.newDoc.title = title
      await this.newDoc.save()
      this.version++
    }
    this.creatingDoc = false
  }

  blurNewDoc = () => {
    if (!this.newItemRef.innerText) {
      this.creatingDoc = false
    }
  }

  onNewItemText = ref => {
    this.newItemRef = ref
    if (ref) {
      ref.focus()
    }
  }
}

@SortableContainer
@view.ui
class SortableChildren {
  render({ items, store }) {
    return (
      <docs $$undraggable>
        {items.map((doc, index) => {
          if (!doc) {
            return null
          }
          const subItems = store.children[doc.id]
          return (
            <SortableItem
              key={doc.id}
              index={index}
              doc={doc}
              subItems={subItems}
            />
          )
        })}
      </docs>
    )
  }
}

@view.attach('rootStore')
@view({
  store: ChildrenStore,
})
export default class Children {
  props: Props

  render({ rootStore, store, store: { hasDocs, sortedDocs } }: Props) {
    log('render')
    return (
      <children $hasChildren={hasDocs}>
        <contents>
          <SortableChildren
            if={hasDocs}
            items={sortedDocs}
            store={store}
            onSortEnd={store.onSortEnd}
            pressDelay={350}
          />
          <Item
            if={store.newDoc}
            editable
            onBlur={store.blurNewDoc}
            temporary
            onSave={store.saveCreatingDoc}
            doc={store.newDoc}
            textRef={store.onNewItemText}
          />
        </contents>
        <space />
        <UI.Popover
          openOnHover
          closeOnClick
          towards="left"
          target={
            <UI.Button circular size={1.2} margin={[0, -5]} icon="simple-add" />
          }
        >
          <UI.List
            elevation={5}
            chromeless
            borderRadius={5}
            padding={2}
            width={140}
            itemProps={{
              size: 0.9,
              color: [0, 0, 0, 0.4],
              hoverColor: [0, 0, 0, 0.7],
            }}
          >
            <UI.ListItem
              primary="Page"
              onClick={store.createDoc}
              icon="filesg"
            />
            <UI.ListItem
              onClick={store.createInbox}
              icon="paper"
              primary="Inbox"
            />
            <UI.ListItem
              if={false}
              onClick={store.createInbox}
              icon="google"
              primary="GDoc"
            />
            <UI.Input icon="attach" />
          </UI.List>
        </UI.Popover>
        <fade $bottom />
      </children>
    )
  }

  static style = {
    children: {
      padding: [0, 18, 0, 4],
      maxWidth: '100%',
      width: '100%',
      alignItems: 'flex-end',
      position: 'relative',
      pointerEvents: 'auto',
      overflow: 'hidden',
    },
    hasChildren: {
      minWidth: 135,
    },
    title: {
      '&:hover > h2': {
        opacity: 1,
      },
    },
    space: {
      paddingBottom: 10,
    },
    contents: {
      marginRight: 5,
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
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
      // background: 'linear-gradient(transparent, #fff)',
    },
  }
}
