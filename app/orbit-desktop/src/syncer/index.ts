import { JiraPersonSyncer } from './jira/JiraPersonSyncer'
import { ConfluenceSyncer } from './confluence/ConfluenceSyncer'
import { GDriveSyncer } from './gdrive/GDriveSyncer'
import { GithubIssueSyncer } from './github/GithubIssueSyncer'
import { GithubPeopleSyncer } from './github/GithubPeopleSyncer'
import { GMailSyncer } from './gmail/GMailSyncer'
import { JiraIssueSync } from './jira/JiraIssueSync'
import { SlackSyncer } from './slack/SlackSyncer'
import {Syncer} from './core/Syncer'
import { MailWhitelisterSyncer } from './mail-whitelister/MailWhitelisterSyncer'

export const Syncers = [
  new Syncer({ type: 'jira', constructor: JiraIssueSync, interval: 1000 * 30 }),
  new Syncer({ type: 'jira', constructor: JiraPersonSyncer, interval: 1000 * 30 }),
  new Syncer({ type: 'confluence', constructor: ConfluenceSyncer, interval: 1000 * 30 }),
  new Syncer({ type: 'gdrive', constructor: GDriveSyncer, interval: 1000 * 30 }),
  new Syncer({ type: 'gmail', constructor: GMailSyncer, interval: 1000 * 30 }),
  new Syncer({ type: 'github', constructor: GithubIssueSyncer, interval: 1000 * 30 }),
  new Syncer({ type: 'github', constructor: GithubPeopleSyncer, interval: 1000 * 30 }),
  new Syncer({ type: 'slack', constructor: SlackSyncer, interval: 1000 * 30 }),
  new Syncer({ constructor: MailWhitelisterSyncer, interval: 1000 * 30 }),
]
