import ConfluenceSyncer from './apps/confluence/index.sync'
import DriveSyncer from './apps/drive/index.sync'
import GithubSyncer from './apps/github/index.sync'
import GmailSyncer from './apps/gmail/index.sync'
import JiraSyncer from './apps/jira/index.sync'
import SlackSyncer from './apps/slack/index.sync'
import WebsiteSyncer from './apps/website/index.sync'

export const syncers = [
  ConfluenceSyncer,
  DriveSyncer,
  GithubSyncer,
  GmailSyncer,
  JiraSyncer,
  SlackSyncer,
  WebsiteSyncer,
]