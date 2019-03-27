import { resolveCommand } from '@o/mediator'
import { AppBit, AppEntity, CallAppBitApiMethodCommand } from '@o/models'
import { getRepository } from 'typeorm'
import { SlackApi } from '@o/slack-app/_/api.node'
import { PostgresApi } from '@o/postgres-app/_/api.node'

export const apis: {
  [key: string]: (appBit: AppBit) => any
} = {
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

export const CallAppBitApiMethodResolver = resolveCommand(
  CallAppBitApiMethodCommand,
  async ({ appId, appIdentifier, method, args }) => {
    if (!apis[appIdentifier]) throw new Error(`No API for app "${appId}" was found`)

    const app = await getRepository(AppEntity).findOneOrFail(appId)
    const api = apis[appIdentifier](app)

    if (!api) throw new Error(`API for app "${appId}" is invalid`)
    if (!api[method]) throw new Error(`No method "${method}" was found in the ${appId}" app`)

    return api[method](...(args || []))
  },
)
