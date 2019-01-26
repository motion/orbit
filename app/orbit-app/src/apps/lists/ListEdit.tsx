import { loadOne, save } from '@mcro/model-bridge'
import { AppModel, ListsApp } from '@mcro/models'
import { Row } from '@mcro/ui'
import * as React from 'react'
import '../../../public/styles/emojimart.css'
import { CreateFolder } from '../../components/CreateFolder'
import { HorizontalSpace } from '../../views'

export default function ListEdit() {
  const handleAdd = async () => {
    let listsApp = (await loadOne(AppModel, {
      args: {
        where: {
          spaceId: this.stores.spaceStore.activeSpace.id,
        },
      },
    })) as ListsApp
    if (!listsApp) {
      listsApp = {
        target: 'app',
        type: 'lists',
        name: 'lists',
        spaceId: this.stores.spaceStore.activeSpace.id,
        data: {
          lists: [],
        },
      }
    }
    listsApp.data.lists.push({ name: this.name, order: 0, pinned: false, bits: [] })
    // create app
    await save(AppModel, listsApp)
  }

  return (
    <Row flex={1} alignItems="center">
      <CreateFolder onAdd={handleAdd} />
      <HorizontalSpace />
    </Row>
  )
}
