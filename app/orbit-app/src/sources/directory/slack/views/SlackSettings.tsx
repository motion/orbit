import { loadMany, save } from '@mcro/model-bridge'
import { SlackChannelModel, SlackSource, SourceModel } from '@mcro/models'
import { SearchableTable, Text, View } from '@mcro/ui'
import { orderBy } from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { DateFormat } from '../../../../views/DateFormat'
import ReactiveCheckBox from '../../../../views/ReactiveCheckBox'
import { WhitelistManager } from '../../../helpers/WhitelistManager'
import { OrbitItemViewProps, OrbitSourceSettingProps } from '../../../types'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'

export default function SlackSettings({ source }: OrbitItemViewProps<'slack'> & OrbitSourceSettingProps<SlackSource>) {

  // setup state
  const [channels, setChannels] = useState(null)
  const [highlightedRows, setHighlightedRows] = useState([])
  const columnSizes = {
    name: '25%',
    topic: '25%',
    members: '20%',
    createdAt: '15%',
    active: '15%',
  }
  // console.log('channels', channels)
  const [whitelist, setWhitelist] = useState(new WhitelistManager({
    source,
    getAll: () => (channels || []).map(channel => channel.id),
  }))

  // refresh whitelist when source or channels change
  useEffect(() => {

    setWhitelist(new WhitelistManager({
      source,
      getAll: () => (channels || []).map(channel => channel.id),
    }))

    return () => whitelist.dispose();

  }, [source.id, JSON.stringify(channels)])

  // load and set channels when source changes
  useEffect(() => {

    // for some reason we can get any source here, so filter out everything except slack
    if (source.type !== 'slack')
      return

    // if we have channels stored in the source - use them at first
    if (source.data.channels) {
      // console.log(`set channels from source`, props.source.data.channels)
      const orderedChannels = orderBy(source.data.channels, ['is_private', 'num_members'], ['asc', 'desc'])
      setChannels(orderedChannels)
    }

    // to make sure we always have a fresh channels we load them form API
    loadMany(SlackChannelModel, {
      args: {
        sourceId: source.id,
      },
    }).then(freshApiChannels => {
      // console.log(`loaded channels from remote`, freshApiRepositories)

      // we check if api channels are changed
      const sourceChannels = source.data.channels
      if (!freshApiChannels ||
        JSON.stringify(sourceChannels) === JSON.stringify(freshApiChannels))
        return

      // console.log(`channels changed, updating`)

      // then we update source data in the db
      const orderedChannels = orderBy(freshApiChannels, ['is_private', 'num_members'], ['asc', 'desc'])
      setChannels(orderedChannels)
      source.data = {
        ...source.data,
        channels: freshApiChannels
      }
      save(SourceModel, {
        id: source.id,
        data: source.data
      })
    })

  }, [source.id])

  // const store = useStore(SlackSettingStore, props)
  // const { source } = props
  return (
    <>
      <SettingManageRow source={source} whitelist={whitelist} />
      <View
        flex={1}
        opacity={whitelist.isWhitelisting ? 0.5 : 1}
        pointerEvents={whitelist.isWhitelisting ? 'none' : 'inherit'}
      >
        <SearchableTable
          virtual
          rowLineHeight={28}
          floating={false}
          columnSizes={columnSizes}
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
          onRowHighlighted={setHighlightedRows}
          rows={(channels || []).map((channel, index) => {
            const topic = channel.topic ? channel.topic.value : ''
            const isActive = whitelist.whilistStatusGetter(channel.id)
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
                  sortValue: whitelist.whilistStatusGetter(channel.id),
                  value: (
                    <ReactiveCheckBox
                      onChange={whitelist.updateWhitelistValueSetter(channel.id)}
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
}
