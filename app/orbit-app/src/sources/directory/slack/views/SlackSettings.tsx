import { ensure, react } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { SlackChannelModel, SlackSource } from '@mcro/models'
import { SlackChannel } from '@mcro/services'
import { SearchableTable, Text, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { orderBy } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { DateFormat } from '../../../../views/DateFormat'
import ReactiveCheckBox from '../../../../views/ReactiveCheckBox'
import { WhitelistManager } from '../../../helpers/WhitelistManager'
import { OrbitItemViewProps, OrbitSourceSettingProps } from '../../../types'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'

type Props = OrbitSourceSettingProps<SlackSource>

class SlackSettingStore {
  props: Props

  syncing = {}
  whitelist = new WhitelistManager({
    source: this.props.source,
    getAll: this.getAllFilterIds.bind(this),
  })

  channels = react(
    () => this.props.source,
    async source => {
      ensure('source', !!source)
      const id = this.props.source.id
      if (!id) {
        throw new Error('No ID for source')
      }
      const channels: SlackChannel[] = await loadMany(SlackChannelModel, {
        args: {
          sourceId: id,
        },
      })
      return orderBy(channels, ['is_private', 'num_members'], ['asc', 'desc'])
    },
    {
      defaultValue: [],
    },
  )

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

export default observer(function SlackSettings(props: OrbitItemViewProps<'slack'> & Props) {
  const store = useStore(SlackSettingStore, props)
  const { source } = props
  return (
    <>
      <SettingManageRow source={source} whitelist={store.whitelist} />
      <View
        flex={1}
        opacity={store.whitelist.isWhitelisting ? 0.5 : 1}
        pointerEvents={store.whitelist.isWhitelisting ? 'none' : 'inherit'}
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
  )
})
