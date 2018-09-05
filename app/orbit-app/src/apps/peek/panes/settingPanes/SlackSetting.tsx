import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, react, compose } from '@mcro/black'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'
import { orderBy } from 'lodash'
import { SettingRepository } from '../../../../repositories'
import { DateFormat } from '../../../../views/DateFormat'
import { Text } from '@mcro/ui'
import { MultiSelectTableShortcutHandler } from '../../../../components/shortcutHandlers/MultiSelectTableShortcutHandler'
import { SlackSettingValues } from '../../../../../../models/src'

const columns = {
  name: {
    value: 'Name',
    sortable: true,
    resizable: true,
  },
  topic: {
    value: 'Topic',
    sortable: true,
    resizable: true,
  },
  members: {
    value: 'Members',
    sortable: true,
    resizable: true,
  },
  createdAt: {
    value: 'Created',
    sortable: true,
    resizable: true,
  },
  active: {
    value: 'Active',
    sortable: true,
  },
}

const itemToRow = (index, channel, topic, isActive, onSync) => {
  return {
    key: `${index}`,
    columns: {
      name: {
        sortValue: channel.name,
        value: channel.name,
      },
      topic: {
        sortValue: topic,
        value: topic,
      },
      members: {
        sortValue: channel.num_members,
        value: channel.num_members,
      },
      createdAt: {
        sortValue: channel.created,
        value: (
          <Text ellipse>
            <DateFormat date={new Date(channel.created * 1000)} />
          </Text>
        ),
      },
      active: {
        sortValue: isActive,
        value: (
          <ReactiveCheckBox onChange={onSync(channel.id)} isActive={isActive} />
        ),
      },
    },
  }
}

class SlackSettingStore {
  props: SettingPaneProps

  syncing = {}
  active = 'repos'

  setActiveKey = key => {
    this.active = key
  }

  columnSizes = {
    name: '25%',
    topic: '25%',
    members: '20%',
    createdAt: '15%',
    active: '15%',
  }

  handleColumnSize = sizes => {
    console.log('handling', sizes)
    this.columnSizes = sizes
  }

  get setting() {
    return this.props.setting
  }

  get service() {
    return this.props.appStore.services.slack
  }

  get allChannels() {
    return orderBy(
      this.service.allChannels || [],
      ['is_private', 'num_members'],
      ['asc', 'desc'],
    )
  }

  rows = react(
    () => this.allChannels,
    channels => {
      return channels.map((channel, index) => {
        const topic = channel.topic ? channel.topic.value : ''
        const isActive = () => this.isSyncing(channel.id)
        return itemToRow(index, channel, topic, isActive, this.onSync)
      })
    },
    {
      defaultValue: [],
    },
  )

  get values() {
    return this.setting.values as SlackSettingValues
  }

  onSync = fullName => async e => {
    this.setting.values = {
      ...this.values,
      channels: {
        ...this.values.channels,
        [fullName]: e.target.checked,
      },
    }
    await SettingRepository.save(this.setting)
  }

  isSyncing = fullName => {
    if (!this.setting || !this.values.channels) {
      return false
    }
    return this.values.channels[fullName] || false
  }

  highlightedRows = []

  handleEnter = e => {
    console.log('enter!!', e)
    if (this.highlightedRows.length) {
      console.log('were highlighted', this.highlightedRows)
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleHighlightedRows = rows => {
    this.highlightedRows = rows
  }
}

const decorator = compose(
  view.attach({ store: SlackSettingStore }),
  view,
)

type Props = SettingPaneProps & { store: SlackSettingStore }

export const SlackSetting = decorator(({ store, children }: Props) => {
  return children({
    belowHead: (
      <UI.Tabs active={store.active} onActive={store.setActiveKey}>
        <UI.Tab key="repos" width="50%" label="Repos" />
        <UI.Tab
          key="issues"
          width="50%"
          label={`Issues (${store.bits ? store.bits.length : 0})`}
        />
      </UI.Tabs>
    ),
    content: (
      <>
        <HideablePane invisible={store.active !== 'repos'}>
          <MultiSelectTableShortcutHandler
            handlers={{ enter: store.handleEnter }}
          >
            <UI.SearchableTable
              virtual
              rowLineHeight={28}
              floating={false}
              columnSizes={store.columnSizes}
              columns={columns}
              multiHighlight
              onRowHighlighted={store.handleHighlightedRows}
              rows={store.rows}
              bodyPlaceholder={
                <div style={{ margin: 'auto' }}>
                  <UI.Text size={1.2}>Loading...</UI.Text>
                </div>
              }
            />
          </MultiSelectTableShortcutHandler>
        </HideablePane>
        <HideablePane invisible={store.active !== 'issues'}>
          {/* <Bits bits={store.bits} /> */}
        </HideablePane>
      </>
    ),
  })
})
