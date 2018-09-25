import { view } from '@mcro/black'
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
import { WhitelistManager } from './stores/WhitelistManager'
import { ManageSmartSync } from './views/ManageSmartSync'

type Props = SettingPaneProps & {
  store?: SlackSettingStore
  setting: SlackSettingModel
}

class SlackSettingStore {
  props: Props
  channels: SlackChannel[] = []

  syncing = {}
  active = 'status'
  setting = new WhitelistManager(this.props.setting)

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

  getAllFilterIds = () => {
    return this.channels.map(x => x.id)
  }
}

@view.attach({ store: SlackSettingStore })
@view
export class SlackSetting extends React.Component<Props> {
  render() {
    const { store, setting, children } = this.props
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
              <ManageSmartSync store={store} />
              <View
                flex={1}
                opacity={store.setting.isWhitelisting ? 0.5 : 1}
                pointerEvents={store.setting.isWhitelisting ? 'none' : 'auto'}
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
                    const isActive = store.setting.whilistStatusGetter(channel.id)
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
                          sortValue: store.setting.whilistStatusGetter(channel.id),
                          value: (
                            <ReactiveCheckBox
                              onChange={store.setting.updateWhitelistValueSetter(
                                channel.id,
                                store.getAllFilterIds,
                              )}
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
            </MultiSelectTableShortcutHandler>
          </HideablePane>
        </>
      ),
    })
  }
}
