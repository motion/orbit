// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Document } from '@mcro/models'
import { sortBy, sum } from 'lodash'
import Router from '~/router'
import { watch } from '@mcro/black'
import Arrow from './arrow'

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
      padding: [5, 20],
      textAlign: 'right',
    },
    title: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '1.1rem',
      color: '#777',
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
    this.newDoc.title = title
    await this.newDoc.save()
    this.setTimeout(() => {
      this.creatingDoc = false
      this.version++
    })
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
        <docs if={hasDocs}>
          {allDocs.map(doc => {
            const children = store.children[doc._id]
            return (
              <Item
                key={doc._id}
                onClick={() => Router.go(doc.url())}
                title={doc.title}
              >
                <subdocs if={children && children.length}>
                  <Arrow $arrow css={{ transform: { scale: 0.5 } }} />
                  {children.map(child =>
                    <UI.Text
                      key={child._id}
                      onClick={() => Router.go(child.url())}
                      size={0.8}
                    >
                      {child.title}
                    </UI.Text>
                  )}
                </subdocs>
              </Item>
            )
          })}
        </docs>
        <Item
          if={store.creatingDoc}
          editable
          onSave={store.saveCreatingDoc}
          textRef={this.onNewItemText}
        />
        <Item
          onClick={store.ref('creatingDoc').setter(true)}
          title="+1"
          css={{
            opacity: 0.2,
          }}
        />
        <shadow if={false} $glow />
        <background $glow />
      </children>
    )
  }

  static style = {
    children: {
      width: 160,
      marginTop: 70,
      padding: [10, 0, 40, 10],
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
        x: '93%',
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
