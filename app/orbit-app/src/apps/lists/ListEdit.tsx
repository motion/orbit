import { attach, view } from '@mcro/black'
import { save } from '@mcro/model-bridge'
import { loadOne } from '@mcro/model-bridge'
import { AppModel, ListsApp } from '@mcro/models'
import { AppType } from '@mcro/models'
import * as React from 'react'
import { SpaceStore } from '../../stores/SpaceStore'
import { Input, Button, Row } from '@mcro/ui'

class ListEditStore {
  name: string = ''
}

@attach({
  store: ListEditStore,
  spaceStore: SpaceStore,
})
@view
export class ListEdit extends React.Component<{ store?: ListEditStore; spaceStore?: SpaceStore }> {
  save = async e => {
    e.preventDefault()

    let listsApp: ListsApp = await loadOne(AppModel, {
      args: {
        type: 'lists' as AppType,
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

    listsApp.data.lists.push({ name: this.props.store.name, order: 0, pinned: false, bits: [] })

    // create a space
    await save(AppModel, listsApp)
    console.log('saved lists app', listsApp)

    this.props.store.name = ''
  }

  handleNameChange = e => (this.props.store.name = e.target.value)

  render() {
    return (
      <Row tagName="form" onSubmit={this.save} padding={16} alignItems="center">
        <Input
          value={this.props.store.name}
          onChange={this.handleNameChange}
          flex={1}
          placeholder="Create new list..."
        />
        <div style={{ width: 10 }} />
        <Button type="submit">Create</Button>
      </Row>
    )
  }
}
