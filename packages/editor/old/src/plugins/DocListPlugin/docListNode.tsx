import { view } from '@o/black'
import { Button, Popover, Row } from '@o/ui'
import React, { useEffect } from 'react'

import { node } from '../views/editor/node'
import DocListStore from './docListStore'
import CardList from './lists/cardListNode'
import GridList from './lists/gridListNode'
import List from './lists/listNode'
import VoteList from './lists/voteListNode'

const getList = type => {
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

@view.attach('docStore')
export const DocListNode = node(({ node, setContext, listType }) => {
  const listStore = useStore(DocListStore)

  useEffect(() => {
    if (setContext) {
      setContext(
        <>
          <Button onMouseDown={listStore.createDoc} icon="add" />
          <Popover target={<Button icon="card" />} openOnHover>
            <Row>
              <Button
                active={listType === 'grid'}
                icon="grid"
                onClick={() => listStore.setType(node, 'grid')}
              />
              <Button
                active={listType === 'card'}
                icon="uilayers"
                onClick={() => listStore.setType(node, 'card')}
              />
              <Button
                active={listType === 'vote'}
                icon="arrows-1_bold-up"
                onClick={() => listStore.setType(node, 'votes')}
              />
              <Button
                active={listType === 'list'}
                icon="list"
                onClick={() => listStore.setType(node, 'list')}
              />
            </Row>
          </Popover>
        </>,
      )
    }
  }, [])

  const hasLoaded = !!listStore.docs
  const listType = node.data.get('listType') || 'card'
  const ListView = this.getList(listType)

  if (editorStore && editorStore.inline && listType === 'grid') {
    return <null>sub doc list</null>
  }

  return (
    <doclist contentEditable={false}>
      <ListView
        shouldFocus={listStore.shouldFocus}
        listStore={listStore}
        editorStore={editorStore}
        node={node}
        {...props}
      />
    </doclist>
  )
})

const style = {
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
