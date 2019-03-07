import { loadMany, useModel } from '@o/bridge'
import { AppProps, WhitelistManager } from '@o/kit'
import { AppModel, SlackChannelModel } from '@o/models'
import { CheckboxReactive, DateFormat, SearchableTable, Text, View } from '@o/ui'
import { useStore } from '@o/use-store'
import { orderBy } from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SettingManageRow } from '../../views/SettingManageRow'

export function SlackSettings(props: AppProps) {
  const { subId } = props.appConfig
  const [app, updateApp] = useModel(AppModel, { where: { id: +subId } })
  const whitelist = useStore(WhitelistManager, {
    app,
    getAll: () => (channels || []).map(channel => channel.id),
  })
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

  // load and set channels when app changes
  useEffect(
    () => {
      if (!app) return
      // for some reason we can get any app here, so filter out everything except slack
      if (app.identifier !== 'slack') return

      // if we have channels stored in the app - use them at first
      if (app.data.channels) {
        // console.log(`set channels from app`, props.app.data.channels)
        const orderedChannels = orderBy(
          app.data.channels,
          ['is_private', 'num_members'],
          ['asc', 'desc'],
        )
        setChannels(orderedChannels)
      }

      // to make sure we always have a fresh channels we load them form API
      loadMany(SlackChannelModel, {
        args: {
          appId: app.id,
        },
      }).then(freshApiChannels => {
        // console.log(`loaded channels from remote`, freshApiRepositories)

        // we check if api channels are changed
        const appChannels = app.data.channels
        if (!freshApiChannels || JSON.stringify(appChannels) === JSON.stringify(freshApiChannels)) {
          return
        }

        // then we update app data in the db
        const orderedChannels = orderBy(
          freshApiChannels,
          ['is_private', 'num_members'],
          ['asc', 'desc'],
        )
        setChannels(orderedChannels)
        app.data = {
          ...app.data,
          channels: freshApiChannels,
        }
        updateApp(app)
      })
    },
    [app && app.id],
  )

  return (
    <>
      <SettingManageRow app={app} whitelist={whitelist} />
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
          highlightedRows={highlightedRows}
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
                    <CheckboxReactive
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
