import { App, AppBit, createApp, SelectApp, Table, useApp } from '@o/kit'
import Slack from '@o/slack-app'
import { Card, GridItem, GridLayout } from '@o/ui'
import React, { useState } from 'react'

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
function CustomApp() {
  const [app, setApp] = useState<AppBit>(null)
  const slack = useApp(Slack, app)
  const res = slack && slack.channelsList()

  return (
    <App>
      <GridLayout>
        <GridItem w={4} h={4}>
          <Card
            afterTitle={<SelectApp onSelect={setApp} />}
            overflow="hidden"
            title="Slack Messages"
          >
            {res && <Table rows={res.channels} />}
          </Card>
        </GridItem>
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
