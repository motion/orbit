import { loadOne, save } from '@mcro/model-bridge'
import { AppModel, ListsApp } from '@mcro/models'
import * as React from 'react'
import { Input, Button, Row } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { StoreContext } from '@mcro/black'
import { SpaceStore } from '../../stores/SpaceStore'
import { observer } from 'mobx-react-lite'

class ListEditStore {
  props: { spaceStore: SpaceStore }

  name: string = ''

  handleNameChange = e => (this.name = e.target.value)

  handleSubmit = async e => {
    e.preventDefault()
    let listsApp: ListsApp = await loadOne(AppModel, {
      args: {
        type: 'lists',
        spaceId: this.props.spaceStore.activeSpace.id,
      },
    })
    if (!listsApp) {
      listsApp = {
        type: 'lists',
        name: 'lists',
        spaceId: this.props.spaceStore.activeSpace.id,
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

export const ListEdit = observer(() => {
  const { spaceStore } = React.useContext(StoreContext)
  const store = useStore(ListEditStore, { spaceStore })

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
