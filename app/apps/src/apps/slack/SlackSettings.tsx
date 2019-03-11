import { loadMany, useModel } from '@o/bridge'
import { AppProps, Table, WhitelistManager } from '@o/kit'
import { AppModel, SlackChannelModel } from '@o/models'
import { CheckboxReactive, View } from '@o/ui'
import { useStore } from '@o/use-store'
import { orderBy } from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SettingManageRow } from '../../views/SettingManageRow'

export function SlackSettings({ subId }: AppProps) {
  const [app, updateApp] = useModel(AppModel, { where: { id: +subId } })
  const whitelist = useStore(WhitelistManager, {
    app,
    getAll: () => (channels || []).map(channel => channel.id),
  })
  // setup state
  const [channels, setChannels] = useState(null)
  const [, setHighlightedRows] = useState([])

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
        <Table
          columns={{
            name: {
              value: 'Name',
              flex: 2,
            },
            topic: {
              value: 'Topic',
              flex: 2,
            },
            members: {
              value: 'Members',
            },
            createdAt: {
              value: 'Created',
            },
            active: {
              value: 'Active',
            },
          }}
          multiHighlight
          onHighlightedIndices={setHighlightedRows}
          rows={(channels || []).map((channel, index) => {
            const topic = channel.topic ? channel.topic.value : ''
            const isActive = whitelist.whilistStatusGetter(channel.id)
            return {
              key: `${index}`,
              values: {
                name: channel.name,
                topic: topic,
                members: channel.num_members,
                createdAt: new Date(channel.created * 1000),
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
        />
      </View>
    </>
  )
}
