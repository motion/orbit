import { ConfluenceContentSyncer } from './confluence/ConfluenceContentSyncer'
import { ConfluencePeopleSyncer } from './confluence/ConfluencePeopleSyncer'
import { Syncer } from './core/Syncer'
import { SyncerGroup } from './core/SyncerGroup'
import { GDriveSyncer } from './gdrive/GDriveSyncer'
import { GithubIssueSyncer } from './github/GithubIssueSyncer'
import { GithubPeopleSyncer } from './github/GithubPeopleSyncer'
import { GMailSyncer } from './gmail/GMailSyncer'
import { JiraIssueSyncer } from './jira/JiraIssueSyncer'
import { JiraPeopleSyncer } from './jira/JiraPeopleSyncer'
import { MailWhitelisterSyncer } from './mail-whitelister/MailWhitelisterSyncer'
import { SlackIssuesSyncer } from './slack/SlackIssuesSyncer'
import { SlackPeopleSyncer } from './slack/SlackPeopleSyncer'

const ONE_MINUTE = 1000 * 60 * 60
const FIVE_MINUTES = ONE_MINUTE * 5
const TEN_MINUTES = ONE_MINUTE * 10

export const Syncers = [
  new Syncer({
    type: 'jira',
    constructor: JiraIssueSyncer,
    interval: TEN_MINUTES,
  }),
  new Syncer({
    type: 'jira',
    constructor: JiraPeopleSyncer,
    interval: TEN_MINUTES,
  }),
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
    type: 'gdocs' as any,
    constructor: GDriveSyncer,
    interval: FIVE_MINUTES,
  }), // todo: fix gdocs as any - to fix that we need to change all gdocs to gdrive
  new Syncer({
    type: 'gmail',
    constructor: GMailSyncer,
    interval: FIVE_MINUTES,
  }),
  new SyncerGroup('GithubSyncers', [
    new Syncer({
      type: 'github',
      constructor: GithubPeopleSyncer,
      interval: TEN_MINUTES,
    }),
    new Syncer({
      type: 'github',
      constructor: GithubIssueSyncer,
      interval: TEN_MINUTES,
    }),
  ]),
  new SyncerGroup('SlackSyncers', [
    new Syncer({
      type: 'slack',
      constructor: SlackPeopleSyncer,
      interval: TEN_MINUTES,
    }),
    new Syncer({
      type: 'slack',
      constructor: SlackIssuesSyncer,
      interval: FIVE_MINUTES,
    }),
  ]),
  new Syncer({ constructor: MailWhitelisterSyncer, interval: TEN_MINUTES }),
]
