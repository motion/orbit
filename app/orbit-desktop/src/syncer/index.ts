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

export const Syncers = [
  new Syncer({ type: 'jira', constructor: JiraIssueSyncer, interval: 1000 * 120 }),
  new Syncer({ type: 'jira', constructor: JiraPeopleSyncer, interval: 1000 * 120 }),
  new SyncerGroup('GithubSyncers', [
    new Syncer({ type: 'confluence', constructor: ConfluencePeopleSyncer, interval: 1000 * 120 }),
    new Syncer({ type: 'confluence', constructor: ConfluenceContentSyncer, interval: 1000 * 120 }),
  ]),
  new Syncer({ type: 'gdocs' as any, constructor: GDriveSyncer, interval: 1000 * 120 }), // todo: fix gdocs as any - to fix that we need to change all gdocs to gdrive
  new Syncer({ type: 'gmail', constructor: GMailSyncer, interval: 1000 * 120 }),
  new SyncerGroup('GithubSyncers', [
    new Syncer({ type: 'github', constructor: GithubPeopleSyncer, interval: 1000 * 120 }),
    new Syncer({ type: 'github', constructor: GithubIssueSyncer, interval: 1000 * 120 }),
  ]),
  new SyncerGroup('SlackSyncers', [
    new Syncer({ type: 'slack', constructor: SlackPeopleSyncer, interval: 1000 * 120 }),
    new Syncer({ type: 'slack', constructor: SlackIssuesSyncer, interval: 1000 * 200 }),
  ]),
  new Syncer({ constructor: MailWhitelisterSyncer, interval: 1000 * 120 }),
]
