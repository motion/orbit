import { ConfluenceContentSyncer } from './integrations/confluence/ConfluenceContentSyncer'
import { ConfluencePeopleSyncer } from './integrations/confluence/ConfluencePeopleSyncer'
import { Syncer } from './core/Syncer'
import { SyncerGroup } from './core/SyncerGroup'
import { GDriveSyncer } from './integrations/gdrive/GDriveSyncer'
import { GithubIssueSyncer } from './integrations/github/GithubIssueSyncer'
import { GMailSyncer } from './integrations/gmail/GMailSyncer'
import { JiraIssueSyncer } from './integrations/jira/JiraIssueSyncer'
import { JiraPeopleSyncer } from './integrations/jira/JiraPeopleSyncer'
import { MailWhitelisterSyncer } from './integrations/mail-whitelister/MailWhitelisterSyncer'
import { SlackMessagesSyncer } from './integrations/slack/SlackMessagesSyncer'
import { SlackPeopleSyncer } from './integrations/slack/SlackPeopleSyncer'

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
    constructor: GithubIssueSyncer,
    interval: TEN_MINUTES,
  }),
  new SyncerGroup('SlackSyncers', [
    new Syncer({
      type: 'slack',
      constructor: SlackPeopleSyncer,
      interval: TEN_MINUTES,
    }),
    new Syncer({
      type: 'slack',
      constructor: SlackMessagesSyncer,
      interval: FIVE_MINUTES,
    }),
  ]),
  new Syncer({ constructor: MailWhitelisterSyncer, interval: TEN_MINUTES }),
]
