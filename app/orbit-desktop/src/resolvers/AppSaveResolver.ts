import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { AppBit, AppEntity, AppSaveCommand } from '@mcro/models'
import { JiraLoader } from '@mcro/apps/_/apps/jira/JiraLoader' // todo(umed) fix it, we don't need to have desktop app dependency on apps
import { ConfluenceLoader } from '@mcro/apps/_/apps/confluence/ConfluenceLoader' // todo(umed) fix it, we don't need to have desktop app dependency on apps
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
    // todo data types will be fixed in this file once each app will handle its save on its own
    // send test request to atlassian server to check app credentials
    log.info('saving app', app)
    if (app.identifier === 'jira') {
      const loader = new JiraLoader(app as AppBit, log)
      await loader.test()
      app.name = extractTeamNameFromDomain((app.data as any).values.credentials.domain)
    } else if (app.identifier === 'confluence') {
      const loader = new ConfluenceLoader(app as AppBit, log)
      await loader.test()
      app.name = extractTeamNameFromDomain((app.data as any).values.credentials.domain)
    } else if (app.identifier === 'website') {
      app.name = (app.data as any).values.url
    }

    // if credentials are okay save the app
    log.info('saving app', app)
    await getRepository(AppEntity).save(app as any) // todo @umed fix it
    log.info('atlassian app saved successfully')

    return { success: true }
  } catch (error) {
    log.error('error during app save', error)
    return { success: false, error: error.message }
  }
})
