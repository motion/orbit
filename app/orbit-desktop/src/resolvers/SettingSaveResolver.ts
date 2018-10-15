import { SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { ConfluenceSetting, JiraSetting, SettingSaveCommand, WebsiteSetting } from '@mcro/models'
import { ConfluenceLoader, JiraLoader } from '@mcro/services'
import { getRepository } from 'typeorm'

const log = new Logger('command:setting-save')

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}

export const SettingSaveResolver = resolveCommand(
  SettingSaveCommand,
  async ({ setting }) => {
    log.info('saving setting', setting)
    try {

      // send test request to atlassian server to check setting credentials
      log.info('saving setting', setting)
      if (setting.type === 'jira') {
        const loader = new JiraLoader(setting)
        await loader.test()
        setting.name = extractTeamNameFromDomain((setting as JiraSetting).values.credentials.domain)

      } else if (setting.type === 'confluence') {
        const loader = new ConfluenceLoader(setting)
        await loader.test()
        setting.name = extractTeamNameFromDomain((setting as ConfluenceSetting).values.credentials.domain)

      } else if (setting.type === 'website') {
        setting.name = (setting as WebsiteSetting).values.url
      }

      // if credentials are okay save the setting
      log.info('saving setting', setting)
      await getRepository(SettingEntity).save(setting)
      log.info('atlassian setting saved successfully')

      return { success: true }
    } catch (error) {
      log.error('error during setting save', error)
      return { success: false, error: error.message }
    }
  },
)
