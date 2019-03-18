import { resolveCommand } from '@o/mediator'
import { AppEntity, CallAppBitApiMethodCommand } from '@o/models'
import { getRepository } from 'typeorm'
import SlackApi from '@o/slack-app/_/api.node'
import PostgresApi from '@o/postgres-app/_/api.node'

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

// const log = new Logger('command:call-app-bit-api-method')

export const CallAppBitApiMethodResolver = resolveCommand(CallAppBitApiMethodCommand, async ({ appId, appIdentifier, method, args }) => {

  if (!apis[appIdentifier])
    throw new Error(`No API for app "${appId}" was found`)
  if (!apis[appIdentifier][method])
    throw new Error(`No method "${method}" was found in the ${appId}" app`)

  const app = await getRepository(AppEntity).findOneOrFail(appId)
  return apis[appIdentifier][method](app, ...(args || []))
})
