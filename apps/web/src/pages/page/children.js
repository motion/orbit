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
  inbox: 'list',
  document: 'filesg',
}

const STYLES = {
  alignRight: {
    buttonMargin: doc => [0, -3, 0, doc && doc.id ? -5 : 0],
    iconTransform: {
      y: -21,
      x: -35,
    },
    surfaceProps: {
      iconAfter: true,
      textAlign: 'right',
    },
  },
  alignLeft: {
    buttonMargin: doc => [0],
    iconTransform: {
      y: -19,
      x: 18,
    },
  },
}

@view.ui
export class Child {
  render({
    doc,
    temporary,
    editable,
    onSave,
    textRef,
    subItems,
    children,
    alignLeft,
    size = 1,
    ...props
  }) {
    const style = STYLES[alignLeft ? 'alignLeft' : 'alignRight']
    const isInbox = doc.type === 'inbox'

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
        <line
          css={{
            position: 'absolute',
            top: 8,
            right: 36,
            width: 3,
            height: 1,
            borderBottom: [1, 'dotted', '#ccc'],
          }}
        />
        <UI.Surface
          background="transparent"
          icon={
            alignLeft && doc.type === 'document'
              ? 'circle-right'
              : ICONS[doc.type]
          }
          iconSize={30 * size}
          iconProps={{
            className: doc.type,
            css: {
              opacity: isInbox ? 0.35 : 0,
              alignSelf: 'flex-start',
              transform: {
                scale: 0.3,
                ...style.iconTransform,
              },
              boxShadow: ['inset  0 0 100px 100px #fff'],
            },
          }}
          align="flex-start"
          justify="flex-end"
          flexFlow="row"
          padding={0}
          marginBottom={-5}
          size={size}
          {...style.surfaceProps}
        >
          <UI.Text
            $title
            fontSize={15 * size}
            lineHeight={`${1.1 * size}rem`}
            if={doc.title || editable}
            editable={editable}
            onFinishEdit={onSave}
            ref={textRef}
          >
            {doc.title}
          </UI.Text>
        </UI.Surface>

        <DragHandle
          if={false}
          css={{ position: 'absolute', top: 11, right: -10, cursor: 'move' }}
        />
      </doccontainer>
    )
  }
  static style = {
    doccontainer: {
      minWidth: 80,
      position: 'relative',
      opacity: 0.8,
      // transition: 'transform ease-in 80ms',
      overflow: 'hidden',
      transform: {
        scale: 1,
        z: 0,
      },
      '&:hover icon.inbox': {
        opacity: '0.6 !important',
      },
    },
    title: {
      marginBottom: 20,
      fontWeight: 300,
      width: '100%',
      color: '#000',
      overflow: 'hidden',
    },
  }

  static theme = props => {
    if (props.alignLeft) {
      return {}
    }

    // alignRight === default
    return {
      doccontainer: {
        marginRight: -12,
        '&:hover': {
          transform: {
            y: 0,
            z: 0,
          },
        },
        title: {
          marginRight: -5,
        },
      },
    }
  }
}

export const SortableChild = SortableElement(props =>
  <Child style={{ zIndex: 1000000 }} {...props} />
)

class ChildrenStore {
  version = 1
  creatingDoc = false

  get document() {
    return this.props.document || this.props.rootStore.document
  }

  @watch
  children = [
    () => this.document && this.document.id + this.version,
    () => this.document && this.document.getChildren(),
  ]

  @watch
  newDoc = () =>
    this.props.allowInsert && this.creatingDoc && this.document
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
export class Children {
  render({ size, items, store, alignLeft }) {
    return (
      <docs $$undraggable>
        {items.map((doc, index) => {
          if (!doc) {
            return null
          }
          return (
            <SortableChild
              key={doc.id}
              index={index}
              doc={doc}
              alignLeft={alignLeft}
              size={size}
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
export default class ChildrenRoot {
  props: Props

  render({
    size,
    allowInsert,
    alignLeft,
    store,
    store: { hasDocs, sortedDocs },
  }: Props) {
    return (
      <children $hasChildren={hasDocs}>
        <contents>
          <Children
            if={hasDocs}
            items={sortedDocs}
            store={store}
            onSortEnd={store.onSortEnd}
            pressDelay={350}
            pressThreshold={35}
            alignLeft={alignLeft}
            size={size}
          />
          <Child
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
          if={allowInsert}
          openOnHover
          closeOnClick
          towards="left"
          target={
            <UI.Button
              circular
              size={0.85}
              margin={[0, 0]}
              icon="simple-add"
              borderStyle="dotted"
            />
          }
        >
          <UI.List
            elevation={5}
            chromeless
            borderRadius={5}
            padding={2}
            width={90}
            itemProps={{
              size: 0.9,
            }}
          >
            <UI.ListItem
              primary="Page"
              onClick={store.createDoc}
              icon="filesg"
            />
            <UI.ListItem
              onClick={store.createInbox}
              icon="list"
              primary="Inbox"
            />
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
      marginRight: -9,
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
