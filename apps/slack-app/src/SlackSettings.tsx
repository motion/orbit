import {
  AppModel,
  AppProps,
  loadMany,
  SettingManageRow,
  Table,
  useModel,
  useStore,
  WhitelistManager,
} from '@o/kit'
import postgresApp from '@o/postgres-app'
import { DataType, View } from '@o/ui'
import { orderBy } from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'
import slackApp from '.'
import { SlackLoader } from './SlackLoader'

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
  useEffect(() => {
    if (!app) return
    // for some reason we can get any app here, so filter out everything except slack
    if (app.identifier !== 'slack') return

    // todo: remove it
    // load slack channels (testing api)
    slackApp
      .api(app)
      .channelsList()
      .then(next => console.log('loaded api channels', next))

    // todo: remove it
    // execute postgres query (testing api)
    loadMany(AppModel, { args: { where: { identifier: 'postgres' } } }).then(postgresApps => {
      console.log('postgresApps', postgresApps)
      for (let postApp of postgresApps) {
        postgresApp
          .api(postApp)
          .query(
            `CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name varchar(255))`,
            [],
          )
          .then(results => {
            console.log(`table created`, results)
            return postgresApp
              .api(postApp)
              .query('INSERT INTO categories(name) VALUES ($1)', ['dummy category'])
          })
          .then(results => {
            console.log(`new row inserted`, results)
            return postgresApp.api(postApp).query('SELECT * FROM categories')
          })
          .then(results => {
            console.log(`got results from ${postApp.name}:`, results)
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

    // to make sure we always have a fresh channels we load them from API
    const loader = new SlackLoader(app)
    loader.loadChannels().then(freshApiChannels => {
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
  }, [app && app.id])

  return (
    <>
      <SettingManageRow app={app} whitelist={whitelist} />
      <View
        flex={1}
        opacity={whitelist.isWhitelisting ? 0.5 : 1}
        pointerEvents={whitelist.isWhitelisting ? 'none' : 'inherit'}
      >
        <Table
          maxHeight={800}
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
          selectable="multi"
          onSelect={x => setHighlightedRows(x)}
          rows={(channels || []).map(channel => {
            const topic = channel.topic ? channel.topic.value : ''
            return {
              name: channel.name,
              topic: topic,
              members: channel.num_members,
              createdAt: new Date(channel.created * 1000),
              active: whitelist.getWhitelisted(channel.id),
            }
          })}
        />
      </View>
    </>
  )
}
