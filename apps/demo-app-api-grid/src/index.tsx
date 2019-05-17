import { AppCard, createApp } from '@o/kit'
import Slack, { SlackConversation } from '@o/slack-app'
import { GridLayout, Tab, Table, Tabs } from '@o/ui'
import React, { useState } from 'react'

export default createApp({
  id: 'demo-app-api-grid',
  name: 'Demo App: API Grid',
  icon: '',
  app: CustomApp,
})

function CustomApp() {
  const [app, setApp] = useState(null)
  const [rooms, setRooms] = useState([])

  console.log('re render custom app')

  return (
    <GridLayout>
      <AppCard key="slack" title="Slack Room" appType={Slack} onChange={setApp}>
        {({ api }) => {
          const res = api.channelsList()
          console.log('re render table', res, api)
          return (
            <Table
              shareable
              selectable="multi"
              items={(res && res.channels) || []}
              onSelect={x => setRooms(x)}
            />
          )
        }}
      </AppCard>
      <AppCard key="slack2" title="Room Messages" appType={Slack} app={app}>
        {({ api }) => (
          <Tabs>
            {rooms.map(room => (
              <Tab key={room.id} label={room.name} pad>
                {() => {
                  const res = api.channelsHistory({ channel: room.id })
                  return <SlackConversation messages={res.messages || []} />
                }}
              </Tab>
            ))}
          </Tabs>
        )}
      </AppCard>
    </GridLayout>
  )
}

// columns={['id', 'members']}
// focusable

// todo: remove it
// load sample repositories (testing api)
// useEffect(
//   () => {
//     if (app) {
//       githubApp
//         .api(app)
//         .listRepositoriesForOrg({ org: 'typeorm' })
//         .then(repos => console.log('repos', repos))
//     }
//   },
//   [app],
// )

// todo: remove it
// execute postgres query (testing api)
// loadMany(AppModel, { args: { where: { identifier: 'postgres' } } }).then(postgresApps => {
//   console.log('postgresApps', postgresApps)
//   for (let postApp of postgresApps) {
//     postgresApp
//       .api(postApp)
//       .query(`SELECT * FROM country`, [])
//       .then(results => {
//         console.log(`countries loaded`, results)
//       })
//   }
// })

// todo: remove it
// load gmail profile (testing api)
// useEffect(() => {
//   if (app) {
//     gmailApp
//       .api(app)
//       .getProfile({ userId: 'me' })
//       .then(profile => console.log('user profile', profile))
//   }
// }, [app])

// todo: remove it
// load something from confluence (testing api)
// useEffect(() => {
//   loadOne(AppModel, { args: { where: { identifier: 'confluence', tabDisplay: 'plain' } } }).then(
//     app => {
//       if (app) {
//         confluenceApp
//           .api(app)
//           .loadUsers()
//           .then(users => console.log('users', users))
//       }
//     },
//   )
// }, [])

// // todo: remove it
//   // load drive files (testing api)
//   useEffect(
//     () => {
//       if (app) {
//         driveApp
//           .api(app)
//           .listFiles()
//           .then(files => console.log('files', files))
//       }
//     },
//     [app],
//   )
