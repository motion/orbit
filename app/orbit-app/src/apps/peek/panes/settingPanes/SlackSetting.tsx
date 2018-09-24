import { compose, react, view } from '@mcro/black'
import { SlackChannelModel, SlackSetting as SlackSettingModel } from '@mcro/models'
import { SlackChannel } from '@mcro/services'
import { orderBy } from 'lodash'
import { loadMany } from '@mcro/model-bridge'
import { Text, Tabs, Tab, View, SearchableTable } from '@mcro/ui'
import * as React from 'react'
import { MultiSelectTableShortcutHandler } from '../../../../components/shortcutHandlers/MultiSelectTableShortcutHandler'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { SettingPaneProps } from './SettingPaneProps'
import { SettingManager } from './stores/SettingManager'
import { ToggleSettingSyncAll } from './views/ToggleSettingSyncAll'

type Props = SettingPaneProps & {
  store?: SlackSettingStore
  setting: SlackSettingModel
}

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
        value: <ReactiveCheckBox onChange={onSync(channel)} isActive={isActive} />,
      },
    },
  }
}

class SlackSettingStore {
  props: Props
  channels: SlackChannel[] = []

  syncing = {}
  active = 'status'
  setting = new SettingManager(this.props.setting)

  async didMount() {
    const channels = await loadMany(SlackChannelModel, {
      args: {
        settingId: this.props.setting.id,
      },
    })
    this.channels = orderBy(channels, ['is_private', 'num_members'], ['asc', 'desc'])
  }

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

  rows = react(
    () => this.channels,
    channels => {
      return channels.map((channel, index) => {
        const topic = channel.topic ? channel.topic.value : ''
        return itemToRow(index, channel, topic, this.whitelistStatus(channel), this.changeWhitelist)
      })
    },
    {
      defaultValue: [],
    },
  )

  highlightedRows = []

  handleEnter = e => {
    if (this.highlightedRows.length) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleHighlightedRows = rows => {
    this.highlightedRows = rows
  }

  toggleSyncAll = () => {
    this.setting.updateValues(values => {
      // if sync all is already enable, register all channels in a whitelist
      if (!values.whitelist) {
        values.whitelist = this.channels.map(channel => channel.id)
      } else {
        // otherwise enable "sync all" mode
        values.whitelist = undefined
      }
    })
  }

  whitelistStatus = (repository: SlackChannel) => () => {
    // if whitelist is undefined we are in "sync all" mode
    if (!this.setting.values.whitelist) {
      return true
    }
    return this.setting.values.whitelist.indexOf(repository.id) !== -1
  }

  get isSyncAllEnabled() {
    return !this.setting.values.whitelist
  }

  changeWhitelist = (channel: SlackChannel) => () => {
    this.setting.updateValues(values => {
      if (!values.whitelist) {
        values.whitelist = this.channels.map(channel => channel.id)
      }
      const index = values.whitelist.indexOf(channel.id)
      if (index === -1) {
        values.whitelist.push(channel.id)
      } else {
        values.whitelist.splice(index, 1)
      }
    })
  }
}

const decorator = compose(
  view.attach({ store: SlackSettingStore }),
  view,
)
export const SlackSetting = decorator(({ store, setting, children }: Props) => {
  return children({
    belowHead: (
      <Tabs active={store.active} onActive={store.setActiveKey}>
        <Tab key="status" width="50%" label="Status" />
        <Tab key="rooms" width="50%" label="Rooms" />
      </Tabs>
    ),
    content: (
      <>
        <HideablePane invisible={store.active !== 'status'}>
          <AppStatusPane setting={setting} />
        </HideablePane>
        <HideablePane invisible={store.active !== 'rooms'}>
          <MultiSelectTableShortcutHandler handlers={{ enter: store.handleEnter }}>
            <ToggleSettingSyncAll store={store} />
            <View
              flex={1}
              opacity={store.isSyncAllEnabled ? 0.5 : 1}
              pointerEvents={store.isSyncAllEnabled ? 'none' : 'auto'}
            >
              <SearchableTable
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
                    <Text size={1.2}>Loading...</Text>
                  </div>
                }
              />
            </View>
          </MultiSelectTableShortcutHandler>
        </HideablePane>
      </>
    ),
  })
})
