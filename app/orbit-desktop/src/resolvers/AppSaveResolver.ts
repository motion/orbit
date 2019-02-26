import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { AppBitEntity, AppSaveCommand, ConfluenceApp, JiraApp, WebsiteApp } from '@mcro/models'
import { ConfluenceLoader, JiraLoader } from '@mcro/services'
import { getRepository } from 'typeorm'

const log = new Logger('command:app-save')

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}

export const AppSaveResolver = resolveCommand(AppSaveCommand, async ({ app }) => {
  log.info('saving app', app)
  try {
    // send test request to atlassian server to check app credentials
    log.info('saving app', app)
    if (app.appId === 'jira') {
      const loader = new JiraLoader(app as JiraApp, log)
      await loader.test()
      app.name = extractTeamNameFromDomain((app as JiraApp).data.values.credentials.domain)
    } else if (app.appId === 'confluence') {
      const loader = new ConfluenceLoader(app as ConfluenceApp, log)
      await loader.test()
      app.name = extractTeamNameFromDomain((app as ConfluenceApp).data.values.credentials.domain)
    } else if (app.appId === 'website') {
      app.name = (app as WebsiteApp).data.values.url
    }

    // if credentials are okay save the app
    log.info('saving app', app)
    await getRepository(AppBitEntity).save(app)
    log.info('atlassian app saved successfully')

    return { success: true }
  } catch (error) {
    log.error('error during app save', error)
    return { success: false, error: error.message }
  }
})
