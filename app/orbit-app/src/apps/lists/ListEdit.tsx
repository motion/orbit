import { loadOne, save } from '@mcro/model-bridge'
import { AppModel, ListsApp } from '@mcro/models'
import { Button, Input, Popover, Row, SegmentedRow, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { Picker } from 'emoji-mart'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import '../../../public/styles/emojimart.css'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { SpaceStore } from '../../stores/SpaceStore'
import { HorizontalSpace } from '../../views'

class ListEditStore {
  props: { spaceStore: SpaceStore }
  stores = useHook(useStoresSafe)

  name: string = ''

  handleNameChange = e => (this.name = e.target.value)

  handleSubmit = async e => {
    e.preventDefault()
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
    console.log('saved lists app', listsApp)
    this.name = ''
  }
}

export default observer(function ListEdit() {
  const store = useStore(ListEditStore)

  return (
    <Row tagName="form" onSubmit={store.handleSubmit} flex={1} alignItems="center">
      <SegmentedRow flex={1}>
        <Popover
          width={368}
          height={452}
          openOnClick
          // closeOnClickAway
          target={
            <Button
              sizeRadius={3}
              icon={
                <View marginLeft={4} fontSize={18}>
                  😓
                </View>
              }
              iconSize={14}
              type="submit"
            />
          }
          background
          borderRadius={10}
          elevation={4}
        >
          <Picker native title="Choose emoji..." />
        </Popover>
        <Input
          value={store.name}
          onChange={store.handleNameChange}
          flex={1}
          placeholder="New folder..."
        />
      </SegmentedRow>
      <HorizontalSpace />
      <Button circular icon="boldadd" type="submit" />
    </Row>
  )
})
