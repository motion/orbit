import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { AtlassianSettingSaveCommand } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SettingEntity } from '../entities/SettingEntity'
import { ConfluenceLoader } from '../syncer/confluence/ConfluenceLoader'
import { JiraLoader } from '../syncer/jira/JiraLoader'

const log = new Logger(`command:atlassian-setting-save`)

export const AtlassianSettingSaveResolver = resolveCommand(AtlassianSettingSaveCommand, async ({ setting }) => {
  log.info(`saving atlassian setting`, setting)
  try {

    // send test request to atlassian server to check setting credentials
    log.info(`saving atlassian setting`, setting)
    if (setting.type === 'jira') {
      const loader = new JiraLoader(setting as SettingEntity)
      await loader.test()

    } else if (setting.type === 'confluence') {
      const loader = new ConfluenceLoader(setting as SettingEntity)
      await loader.test()
    }

    // if credentials are okay save the setting
    log.info(`saving atlassian setting`, setting)
    await getRepository(SettingEntity).save(setting as SettingEntity)
    log.info(`atlassian setting saved successfully`)

    return { success: true }

  } catch (error) {
    log.error(`error during atlassian setting save`, error)
    return { success: false, error: error.message }
  }
})