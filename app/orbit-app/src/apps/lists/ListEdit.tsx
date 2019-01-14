import { loadOne, save } from '@mcro/model-bridge'
import { AppModel, ListsApp } from '@mcro/models'
import * as React from 'react'
import { Input, Button, Row } from '@mcro/ui'
import { useStore, useHook } from '@mcro/use-store'
import { SpaceStore } from '../../stores/SpaceStore'
import { observer } from 'mobx-react-lite'
import { useStoresSafe } from '../../hooks/useStoresSafe'

class ListEditStore {
  props: { spaceStore: SpaceStore }
  stores = useHook(useStoresSafe)

  name: string = ''

  handleNameChange = e => (this.name = e.target.value)

  handleSubmit = async e => {
    e.preventDefault()
    let listsApp: ListsApp = await loadOne(AppModel, {
      args: {
        type: 'lists',
        spaceId: this.stores.spaceStore.activeSpace.id,
      },
    })
    if (!listsApp) {
      listsApp = {
        type: 'lists',
        name: 'lists',
        spaceId: this.stores.spaceStore.activeSpace.id,
        data: {
          lists: [],
        },
      }
    }
    listsApp.data.lists.push({ name: this.name, order: 0, pinned: false, bits: [] })
    // create a space
    await save(AppModel, listsApp)
    console.log('saved lists app', listsApp)
    this.name = ''
  }
}

export default observer(function ListEdit() {
  const store = useStore(ListEditStore)

  return (
    <Row tagName="form" onSubmit={store.handleSubmit} padding={10} alignItems="center">
      <Input
        value={store.name}
        onChange={store.handleNameChange}
        flex={1}
        placeholder="Create..."
      />
      <div style={{ width: 10 }} />
      <Button icon="boldadd" type="submit" />
    </Row>
  )
})
