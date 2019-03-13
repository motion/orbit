import { SyncerOptions } from '@o/sync-kit'
import ConfluenceSyncer from '@o/confluence-app/_/index.sync'
import DriveSyncer from '@o/drive-app/_/index.sync'
import GithubSyncer from '@o/github-app/_/index.sync'
import GmailSyncer from '@o/gmail-app/_/index.sync'
import JiraSyncer from '@o/jira-app/_/index.sync'
import SlackSyncer from '@o/slack-app/_/index.sync'
import WebsiteSyncer from '@o/website-app/_/index.sync'

export const syncers: SyncerOptions[] = [
  ConfluenceSyncer,
  DriveSyncer,
  GithubSyncer,
  GmailSyncer,
  JiraSyncer,
  SlackSyncer,
  WebsiteSyncer,
]
