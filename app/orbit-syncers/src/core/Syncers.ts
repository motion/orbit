import { ConfluenceContentSyncer } from '../integrations/confluence/ConfluenceContentSyncer'
import { ConfluencePeopleSyncer } from '../integrations/confluence/ConfluencePeopleSyncer'
import { GDriveSyncer } from '../integrations/gdrive/GDriveSyncer'
import { GithubSyncer } from '../integrations/github/GithubSyncer'
import { GMailSyncer } from '../integrations/gmail/GMailSyncer'
import { JiraIssueSyncer } from '../integrations/jira/JiraIssueSyncer'
import { JiraPeopleSyncer } from '../integrations/jira/JiraPeopleSyncer'
import { MailWhitelisterSyncer } from '../integrations/mail-whitelister/MailWhitelisterSyncer'
import { SlackSyncer } from '../integrations/slack/SlackSyncer'
import { Syncer } from './Syncer'
import { SyncerGroup } from './SyncerGroup'

const ONE_MINUTE = 1000 * 60
const FIVE_MINUTES = ONE_MINUTE * 5
const TEN_MINUTES = ONE_MINUTE * 10

export const Syncers = [
  new SyncerGroup('JiraSyncers', [
    new Syncer({
      type: 'jira',
      constructor: JiraPeopleSyncer,
      interval: TEN_MINUTES,
    }),
    new Syncer({
      type: 'jira',
      constructor: JiraIssueSyncer,
      interval: TEN_MINUTES,
    }),
  ]),
  new SyncerGroup('GithubSyncers', [
    new Syncer({
      type: 'confluence',
      constructor: ConfluencePeopleSyncer,
      interval: TEN_MINUTES,
    }),
    new Syncer({
      type: 'confluence',
      constructor: ConfluenceContentSyncer,
      interval: TEN_MINUTES,
    }),
  ]),
  new Syncer({
    type: 'gdrive',
    constructor: GDriveSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    type: 'gmail',
    constructor: GMailSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({
    type: 'github',
    constructor: GithubSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    type: 'slack',
    constructor: SlackSyncer,
    interval: FIVE_MINUTES,
  }),
  new Syncer({ constructor: MailWhitelisterSyncer, interval: TEN_MINUTES }),
]
