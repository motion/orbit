import { view } from '@mcro/black'
import { SlackChannelModel, SlackSetting as SlackSettingModel } from '@mcro/models'
import { SlackChannel } from '@mcro/services'
import { orderBy } from 'lodash'
import { loadMany } from '@mcro/model-bridge'
import { Text, View, SearchableTable } from '@mcro/ui'
import * as React from 'react'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { WhitelistManager } from './stores/WhitelistManager'
import { PeekSettingProps } from '../PeekSetting'
import { SettingManageRow } from './views/SettingManageRow'
import { SimpleAppExplorer } from './views/SimpleAppExplorer'

type Props = PeekSettingProps<SlackSettingModel>

class SlackSettingStore {
  props: Props
  channels: SlackChannel[] = []

  syncing = {}
  whitelist = new WhitelistManager({
    setting: this.props.setting,
    getAll: this.getAllFilterIds.bind(this),
  })

  async didMount() {
    const channels = await loadMany(SlackChannelModel, {
      args: {
        settingId: this.props.setting.id,
      },
    })
    this.channels = orderBy(channels, ['is_private', 'num_members'], ['asc', 'desc'])
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

  private getAllFilterIds() {
    return this.channels.map(x => x.id)
  }
}

@view.attach({ store: SlackSettingStore })
@view
export class SlackSetting extends React.Component<Props & { store?: SlackSettingStore }> {
  render() {
    const { store, setting } = this.props
    return (
      <SimpleAppExplorer
        setting={setting}
        settingsPane={
          <>
            <SettingManageRow store={store} setting={setting} />
            <View
              flex={1}
              opacity={store.whitelist.isWhitelisting ? 0.5 : 1}
              pointerEvents={store.whitelist.isWhitelisting ? 'none' : 'auto'}
            >
              <SearchableTable
                virtual
                rowLineHeight={28}
                floating={false}
                columnSizes={store.columnSizes}
                columns={{
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
                }}
                multiHighlight
                onRowHighlighted={store.handleHighlightedRows}
                rows={store.channels.map((channel, index) => {
                  const topic = channel.topic ? channel.topic.value : ''
                  const isActive = store.whitelist.whilistStatusGetter(channel.id)
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
                        sortValue: store.whitelist.whilistStatusGetter(channel.id),
                        value: (
                          <ReactiveCheckBox
                            onChange={store.whitelist.updateWhitelistValueSetter(channel.id)}
                            isActive={isActive}
                          />
                        ),
                      },
                    },
                  }
                })}
                bodyPlaceholder={
                  <div style={{ margin: 'auto' }}>
                    <Text size={1.2}>Loading...</Text>
                  </div>
                }
              />
            </View>
          </>
        }
      />
    )
  }
}
