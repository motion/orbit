import { App, AppCard, createApp } from '@o/kit'
import Slack from '@o/slack-app'
import { GridLayout, Tab, Table, Tabs } from '@o/ui'
import React, { useState } from 'react'

function CustomApp() {
  const [app, setApp] = useState(null)
  const [rooms, setRooms] = useState([])

  return (
    <App>
      <GridLayout>
        <AppCard key="slack" title="Slack Room" appType={Slack} onChange={setApp}>
          {({ api }) => {
            const res = api.channelsList()
            return (
              <Table
                // columns={['id', 'members']}
                shareable
                // focusable
                selectable="multi"
                rows={(res && res.channels) || {}}
                onSelect={setRooms}
              />
            )
          }}
        </AppCard>
        <AppCard key="slack2" title="Room Messages" appType={Slack} app={app}>
          {({ api }) => {
            const [active, setActive] = useState(null)
            console.log('active', active)
            const res = active && api.channelsHistory({ channel: active.channel })

            return (
              <>
                <Tabs onChange={x => setActive(x)}>
                  {rooms.map(room => (
                    <Tab key={room.id} label={room.name || 'pok'} />
                  ))}
                </Tabs>
                {JSON.stringify(res || {})}
              </>
            )
          }}
        </AppCard>
      </GridLayout>
    </App>
  )
}

export default createApp({
  id: 'custom',
  name: 'Custom',
  icon: '',
  app: CustomApp,
})

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
