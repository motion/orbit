import React from 'react'
import { node, view } from '~/helpers'
import App, { Document } from '@jot/models'
import { Segment, Button } from '~/ui'
import { isEqual } from 'lodash'
import Router from '~/router'
import CardList from './lists/card'
import GridList from './lists/grid'
import List from './lists/list'

class DocListStore {
  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document
  docs = !this.props.editorStore.inline &&
    Document.forPlace(this.place && this.place._id)

  shouldFocus = false

  createDoc = async () => {
    await Document.create({ places: [this.place._id] })
    this.setTimeout(() => {
      this.shouldFocus = true
    }, 200)
  }

  get place() {
    return App.activePage.place
  }

  setType = (node, listType: string) => {
    const next = node.data.set('listType', listType)
    this.props.onChange(next)
  }

  doneFocusing = () => {
    this.shouldFocus = false
  }
}

@node
@view({
  store: DocListStore,
})
export default class DocList {
  static plain = true

  getList = type => {
    switch (type) {
      case 'list':
        return List
      case 'grid':
        return GridList
      case 'card':
        return CardList
    }
  }

  render({ node, editorStore, store, children, attributes, ...props }) {
    // if (editorStore && editorStore.inline) {
    //   return <null>sub doc list</null>
    // }

    const hasLoaded = !!store.docs
    const hasDocs = hasLoaded && store.docs.length > 0
    const listType = node.data.get('listType') || 'card'
    const ListView = this.getList(listType)

    return (
      <doclist contentEditable={false}>
        <config>
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
