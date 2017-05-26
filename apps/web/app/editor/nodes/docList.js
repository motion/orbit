import React from 'react'
import { view } from '~/helpers'
import node from '~/editor/node'
import App, { Document } from '@jot/models'
import { Segment, Button } from '~/ui'
import { isEqual } from 'lodash'
import Router from '~/router'
import CardList from './lists/card'
import GridList from './lists/grid'
import VoteList from './lists/vote'
import List from './lists/list'

class DocListStore {
  get place() {
    return this.props.placeStore.place
  }

  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  docs = Document.forPlace(this.place && this.place._id)

  shouldFocus = false

  createDoc = async () => {
    if (!this.props.placeStore) {
      await Document.create()
    } else {
      await Document.create({ places: [this.props.placeStore.place._id] })
    }
    this.setTimeout(() => {
      this.shouldFocus = true
    }, 200)
  }

  setType = (node, listType: string) => {
    const next = node.data.set('listType', listType)
    this.props.setData(next)
  }

  doneFocusing = () => {
    this.shouldFocus = false
  }
}

@node
@view.attach('placeStore')
@view({
  store: DocListStore,
})
export default class DocList {
  getList = type => {
    switch (type) {
      case 'list':
        return List
      case 'grid':
        return GridList
      case 'card':
        return CardList
      case 'votes':
        return VoteList
    }
  }

  render({
    placeStore,
    node,
    editorStore,
    store,
    children,
    attributes,
    ...props
  }) {
    const hasLoaded = !!store.docs
    const listType = node.data.get('listType') || 'card'
    const ListView = this.getList(listType)

    if (editorStore && editorStore.inline && listType === 'grid') {
      return <null>sub doc list</null>
    }

    return (
      <doclist contentEditable={false}>
        <config contentEditable={false}>
          <Segment>
            <Button
              active={listType === 'grid'}
              icon="grid"
              onClick={() => store.setType(node, 'grid')}
            />
            <Button
              active={listType === 'card'}
              icon="uilayers"
              onClick={() => store.setType(node, 'card')}
            />
            <Button
              active={listType === 'vote'}
              icon="arrows-1_bold-up"
              onClick={() => store.setType(node, 'votes')}
            />
            <Button
              active={listType === 'list'}
              icon="list"
              onClick={() => store.setType(node, 'list')}
            />
          </Segment>
        </config>
        <content>
          <ListView
            shouldFocus={store.shouldFocus}
            listStore={store}
            editorStore={editorStore}
            node={node}
            {...props}
          />
        </content>
      </doclist>
    )
  }

  static style = {
    doclist: {
      position: 'relative',
    },
    config: {
      position: 'absolute',
      top: -20,
      right: 0,
    },
    card: {
      // background: '#fff',
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttons: {
      flexFlow: 'row',
    },
    active: {
      background: 'red',
      color: '#fff',
    },
  }
}
