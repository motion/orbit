import { SourceEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { resolveCommand } from '@mcro/mediator'
import { ConfluenceSource, JiraSource, SourceSaveCommand, WebsiteSource } from '@mcro/models'
import { ConfluenceLoader, JiraLoader } from '@mcro/services'
import { getRepository } from 'typeorm'

const log = new Logger('command:source-save')

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}

export const SourceSaveResolver = resolveCommand(SourceSaveCommand, async ({ source }) => {
  log.info('saving source', source)
  try {
    // send test request to atlassian server to check source credentials
    log.info('saving source', source)
    if (source.type === 'jira') {
      const loader = new JiraLoader(source as JiraSource, log)
      await loader.test()
      source.name = extractTeamNameFromDomain((source as JiraSource).values.credentials.domain)
    } else if (source.type === 'confluence') {
      const loader = new ConfluenceLoader(source as ConfluenceSource, log)
      await loader.test()
      source.name = extractTeamNameFromDomain(
        (source as ConfluenceSource).values.credentials.domain,
      )
    } else if (source.type === 'website') {
      source.name = (source as WebsiteSource).values.url
    }

    // if credentials are okay save the source
    log.info('saving source', source)
    await getRepository(SourceEntity).save(source)
    log.info('atlassian source saved successfully')

    return { success: true }
  } catch (error) {
    log.error('error during source save', error)
    return { success: false, error: error.message }
  }
})
