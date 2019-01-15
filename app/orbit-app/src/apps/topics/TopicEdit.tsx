import { save } from '@mcro/model-bridge'
import { loadOne } from '@mcro/model-bridge'
import { AppType, AppModel, TopicsApp } from '@mcro/models'
import * as React from 'react'
import { SpaceStore } from '../../stores/SpaceStore'
import { Input, Button, Row } from '@mcro/ui'
import { IS_MINIMAL } from '../../constants'
import { useStore, useHook } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import { useStoresSafe } from '../../hooks/useStoresSafe'

class TopicEditStore {
  stores = useHook(useStoresSafe)
  name: string = ''

  handleNameChange = e => {
    this.name = e.target.value
  }

  save = async e => {
    e.preventDefault()

    let topicsApp: TopicsApp = await loadOne(AppModel, {
      args: {
        type: 'topics' as AppType,
        spaceId: this.stores.spaceStore.activeSpace.id,
      },
    })

    if (!topicsApp) {
      topicsApp = {
        type: 'topics',
        name: 'topics',
        spaceId: this.stores.spaceStore.activeSpace.id,
        data: {
          topics: [],
        },
      }
    }

    topicsApp.data.watching.push({ name: this.name, order: 0, pinned: false, bits: [] })

    // create a space
    await save(AppModel, topicsApp)
    console.log('saved topics app', topicsApp)

    this.name = ''
  }
}

export const TopicEdit = observer(
  (props: { type: 'term' | 'topic'; store?: TopicEditStore; spaceStore?: SpaceStore }) => {
    const store = useStore(TopicEditStore, props)
    return (
      <Row tagName="form" onSubmit={store.save} alignItems="center">
        <Input
          value={store.name}
          onChange={store.handleNameChange}
          flex={1}
          placeholder={`New ${props.type}...`}
        />
        <div style={{ width: 10 }} />
        <Button type="submit" icon="add">
          {IS_MINIMAL ? '' : 'Add'}
        </Button>
      </Row>
    )
  },
)
