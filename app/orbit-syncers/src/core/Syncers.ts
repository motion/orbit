// import { apps } from '@o/apps/_/apps'
import { syncers } from '@o/apps/_/syncers'
import { Syncer } from './Syncer'

const apps = []

// const ONE_MINUTE = 1000 * 60
// const FIVE_MINUTES = ONE_MINUTE * 5
// const TEN_MINUTES = ONE_MINUTE * 10
// const THIRTY_MINUTES = ONE_MINUTE * 30

export const Syncers = []
apps.forEach((app, index) => {
  Syncers.push(
    new Syncer({
      name: app.name,
      appIdentifier: app.id as any, // todo @umed fix it
      runner: syncers[index].runner,
      interval: syncers[index].interval,
    }),
  )
})

/*export const Syncers = [
  new Syncer({
    appIdentifier: 'jira',
    constructor: JiraSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    appIdentifier: 'confluence',
    constructor: ConfluenceSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    appIdentifier: 'drive',
    constructor: DriveSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    appIdentifier: 'gmail',
    constructor: GMailSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    appIdentifier: 'github',
    constructor: GithubSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    appIdentifier: 'slack',
    constructor: SlackSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    constructor: MailWhitelisterSyncer,
    interval: TEN_MINUTES,
  }),
  // new Syncer({
  //   constructor: PinnedUrlsSyncer,
  //   interval: THIRTY_MINUTES,
  // }),
  new Syncer({
    appIdentifier: 'website',
    constructor: WebsiteSyncer,
    interval: FIVE_MINUTES,
  }),
]*/
