import { WorkerOptions } from '@o/worker-kit'

import { Syncer } from './Syncer'

// TODO @nate once we get dynamic loading

// ⚠️️️️️️️️️️️️️️️️️
// ⚠️️️️️️️️️️️️️️️️️
// ⚠️️️️️️️️️️️️️️️️️
// ⚠️️️️️️️️️️️️️️️️️
// ⚠️️️️️️️️️️️️️️️️️
// ⚠️️️️️️️️️️️️️️️️️
// ⚠️️️️️️️️️️️️️️️️️

// import ConfluenceSyncer from '@o/confluence-app/_/index.sync'
// import DriveSyncer from '@o/drive-app/_/index.sync'
// import GithubSyncer from '@o/github-app/_/index.sync'
// import GmailSyncer from '@o/gmail-app/_/index.sync'
// import JiraSyncer from '@o/jira-app/_/index.sync'
// import SlackSyncer from '@o/slack-app/_/index.sync'
// import WebsiteSyncer from '@o/website-app/_/index.sync'

export const syncers: WorkerOptions[] = [
  // ConfluenceSyncer,
  // DriveSyncer,
  // GithubSyncer,
  // GmailSyncer,
  // JiraSyncer,
  // SlackSyncer,
  // WebsiteSyncer,
]

export const Syncers = []
syncers.forEach(app => {
  Syncers.push(
    new Syncer({
      id: app.id,
      name: app.name,
      appIdentifier: app.id,
      runner: app.runner,
      interval: app.interval,
    }),
  )
})
