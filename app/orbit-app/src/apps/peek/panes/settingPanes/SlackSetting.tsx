import { compose, react, view } from '@mcro/black'
import { SettingModel, SlackChannelModel, SlackSettingValues } from '@mcro/models'
import { SlackChannel } from '@mcro/services'
import * as UI from '@mcro/ui'
import { orderBy } from 'lodash'
import { loadMany, save } from '@mcro/model-bridge'
import { Text } from '@mcro/ui'
import * as React from 'react'
import { MultiSelectTableShortcutHandler } from '../../../../components/shortcutHandlers/MultiSelectTableShortcutHandler'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { SettingPaneProps } from './SettingPaneProps'

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
  props: SettingPaneProps
  channels: SlackChannel[] = []

  syncing = {}
  active = 'status'

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

  get setting() {
    return this.props.setting
  }

  get values() {
    return this.setting.values as SlackSettingValues
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

    // if sync all is already enable, register all channels in a whitelist
    if (this.values.whitelist === undefined) {
      this.values.whitelist = this.channels.map(channel => channel.id)

    } else { // otherwise enable "sync all" mode
      this.values.whitelist = undefined
    }
    save(SettingModel, this.setting)
  }

  whitelistStatus = (repository: SlackChannel) => () => {

    // if whitelist is undefined we are in "sync all" mode
    if (this.values.whitelist === undefined)
      return true

    return this.values.whitelist.indexOf(repository.id) !== -1
  }

  isSyncAllEnabled = () => {
    return this.values.whitelist === undefined
  }

  changeWhitelist = (channel: SlackChannel) => () => {
    if (!this.values.whitelist) {
      this.values.whitelist = this.channels
        .map(channel => channel.id)
    }

    const index = this.values.whitelist.indexOf(channel.id)
    if (index === -1) {
      this.values.whitelist.push(channel.id)
    } else {
      this.values.whitelist.splice(index, 1)
    }
    save(SettingModel, this.setting)
  }
}

const decorator = compose(
  view.attach({ store: SlackSettingStore }),
  view,
)

type Props = SettingPaneProps & { store: SlackSettingStore }

export const SlackSetting = decorator(({ store, setting, children }: Props) => {
  return children({
    belowHead: (
      <UI.Tabs active={store.active} onActive={store.setActiveKey}>
        <UI.Tab key="status" width="50%" label="Status" />
        <UI.Tab key="rooms" width="50%" label="Rooms" />
      </UI.Tabs>
    ),
    content: (
      <>
        <HideablePane invisible={store.active !== 'status'}>
          <AppStatusPane setting={setting} />
        </HideablePane>
        <HideablePane invisible={store.active !== 'rooms'}>
          <MultiSelectTableShortcutHandler handlers={{ enter: store.handleEnter }}>
            <div>
              <ReactiveCheckBox onChange={store.toggleSyncAll} isActive={store.isSyncAllEnabled} /> Sync all
            </div>
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
      </>
    ),
  })
})
