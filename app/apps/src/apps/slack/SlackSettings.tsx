import { loadMany, useModel } from '@o/bridge'
import { AppProps, Table, WhitelistManager } from '@o/kit'
import { AppModel, SlackChannelModel } from '@o/models'
import { DataType, View } from '@o/ui'
import { useStore } from '@o/use-store'
import { orderBy } from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SettingManageRow } from '../../views/SettingManageRow'
import slackApp from './index'
import postgresApp from '../postgres/index'

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

      // todo: remove it
      // load slack channels (testing api)
      slackApp.API
        .loadChannels(app.id)
        .then(channels => console.log('loaded api channels', channels));

      // todo: remove it
      // execute postgres query (testing api)
      loadMany(AppModel, { args: { where: { identifier: 'postgres' } } })
        .then(postgresApps => {
          console.log('postgresApps', postgresApps)
          for (let app of postgresApps) {
            postgresApp
              .API
              .query(app.id, `CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name varchar(255))`, [])
              .then(results => {
                console.log(`table created`, results)
                return postgresApp.API.query(app.id, "INSERT INTO categories(name) VALUES ($1)", ['dummy category'])

              }).then(results => {
                console.log(`new row inserted`, results)
                return postgresApp.API.query(app.id, "SELECT * FROM categories")
              })
              .then(results => {
                console.log(`got results from ${app.name}:`, results)
              })
          }
        })



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
              type: DataType.number,
              value: 'Members',
            },
            createdAt: {
              type: DataType.date,
              value: 'Created',
            },
            active: {
              value: 'Active',
              type: DataType.boolean,
              onChange(index) {
                whitelist.toggleWhitelisted(channels[index].id)
              },
            },
          }}
          multiHighlight
          onHighlightedIndices={setHighlightedRows}
          rows={(channels || []).map((channel, index) => {
            const topic = channel.topic ? channel.topic.value : ''
            return {
              key: `${index}`,
              values: {
                name: channel.name,
                topic: topic,
                members: channel.num_members,
                createdAt: new Date(channel.created * 1000),
                active: whitelist.getWhitelisted(channel.id),
              },
            }
          })}
        />
      </View>
    </>
  )
}
