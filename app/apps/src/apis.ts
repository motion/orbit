// import ConfluenceApi from './apps/confluence/api.node'
// import DriveApi from './apps/drive/api.node'
// import GithubApi from './apps/github/api.node'
// import GmailApi from './apps/gmail/api.node'
// import JiraApi from './apps/jira/api.node'
import SlackApi from '@o/slack-app/_/api.node'
import PostgresApi from '@o/postgres-app/_/api.node'
// import WebsiteApi from './apps/website/api.node'

export const apis: any = {
  // confluence: ConfluenceApi,
  // drive: DriveApi,
  // github: GithubApi,
  // gmail: GmailApi,
  // jira: JiraApi,
  slack: SlackApi,
  postgres: PostgresApi,
  // website: WebsiteApi,
}