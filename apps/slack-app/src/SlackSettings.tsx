import { SettingManageRow, useAppBit, useAppState, useWhiteList } from '@o/kit'
import { DataType, Table, View } from '@o/ui'
import { orderBy } from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { SlackLoader } from './SlackLoader'

export function SlackSettings() {
  // setup state
  const [app] = useAppBit()
  const [channels, setChannels] = useAppState('channels', [])
  const [, setHighlightedItems] = useState([])
  const whitelist = useWhiteList(`${app.id}-whitelist`, {
    getAll: () => (channels || []).map(channel => channel.id),
  })

  // load and set channels when app changes
  useEffect(() => {
    if (!app) return
    // to make sure we always have a fresh channels we load them from API
    const loader = new SlackLoader(app)
    loader.loadChannels().then(freshApiChannels => {
      setChannels(() => orderBy(freshApiChannels, ['is_private', 'num_members'], ['asc', 'desc']))
    })
  }, [app && app.token])

  const items = (channels || []).map(channel => {
    return {
      name: channel.name,
      topic: channel.topic ? channel.topic.value : '',
      members: channel.num_members,
      createdAt: new Date(channel.created * 1000),
      active: whitelist.getWhitelisted(channel.id),
    }
  })

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
            name: 'Name',
            topic: 'Topic',
            members: 'Members',
            createdAt: 'Created',
            active: {
              value: 'Active',
              type: DataType.boolean,
              onChange(index) {
                whitelist.toggleWhitelisted(channels[index].id)
              },
            },
          }}
          selectable="multi"
          onSelect={x => setHighlightedItems(x)}
          items={items}
        />
      </View>
    </>
  )
}
