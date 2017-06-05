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
import DocListStore from './store'

@view.attach('placeStore')
@node
@view({
  store: DocListStore,
})
export default class DocList {
  static contextMenu = props => <test>hello</test>

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
      <doclist spellCheck={false} contentEditable={false}>
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
    top: {
      paddingTop: 3,
      paddingBottom: 3,
      fontSize: 14,
      color: '#555',
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
