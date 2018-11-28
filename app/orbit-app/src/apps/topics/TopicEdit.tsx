import { attach, view } from '@mcro/black'
import { save } from '@mcro/model-bridge'
import { loadOne } from '@mcro/model-bridge'
import { AppModel, TopicsApp } from '@mcro/models'
import { AppType } from '@mcro/models'
import * as React from 'react'
import { SpaceStore } from '../../stores/SpaceStore'
import { Input, Button, Row } from '@mcro/ui'
import { IS_MINIMAL } from '../../constants'

class TopicEditStore {
  name: string = ''
}

@attach('spaceStore')
@attach({
  store: TopicEditStore,
})
@view
export class TopicEdit extends React.Component<{
  type: 'term' | 'topic'
  store?: TopicEditStore
  spaceStore?: SpaceStore
}> {
  save = async e => {
    e.preventDefault()

    let topicsApp: TopicsApp = await loadOne(AppModel, {
      args: {
        type: 'topics' as AppType,
        spaceId: this.props.spaceStore.activeSpace.id,
      },
    })

    if (!topicsApp) {
      topicsApp = {
        type: 'topics',
        name: 'topics',
        spaceId: this.props.spaceStore.activeSpace.id,
        data: {
          topics: [],
        },
      }
    }

    topicsApp.data.watching.push({ name: this.props.store.name, order: 0, pinned: false, bits: [] })

    // create a space
    await save(AppModel, topicsApp)
    console.log('saved topics app', topicsApp)

    this.props.store.name = ''
  }

  handleNameChange = e => (this.props.store.name = e.target.value)

  render() {
    return (
      <Row tagName="form" onSubmit={this.save} alignItems="center">
        <Input
          value={this.props.store.name}
          onChange={this.handleNameChange}
          flex={1}
          placeholder={`New ${this.props.type}...`}
        />
        <div style={{ width: 10 }} />
        <Button type="submit" icon="add">
          {IS_MINIMAL ? '' : 'Add'}
        </Button>
      </Row>
    )
  }
}
