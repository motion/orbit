import { Bit } from '@mcro/models'
import { BitEntity } from '../../entities/BitEntity'
import { createOrUpdateBit } from '../../helpers/createOrUpdateBit'
import { IntegrationSyncer } from '../../syncer/core/IntegrationSyncer'
import { JiraIssue, JiraIssueResponse } from './JiraIssueTypes'
import { fetchFromAtlassian } from './JiraUtils'
import { SettingEntity } from '../../entities/SettingEntity'
import { logger } from '@motion/logger'

const log = logger('syncer:jira:issue')

export class JiraIssueSync implements IntegrationSyncer {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  async run(): Promise<void> {
    const issues = await this.syncIssues(0)
    log(`created ${issues.length} jira issues`, issues)
  }

  async reset(): Promise<void> {

  }

  private async syncIssues(startAt: number): Promise<Bit[]> {
    const maxResults = 100
    const url = `/rest/api/2/search?maxResults=${maxResults}&startAt=${startAt}`

    // loading issues from atlassian server
    log(
      `loading ${startAt === 0 ? 'first' : 'next'} ${maxResults} issues`,
    )
    const searchResult: JiraIssueResponse = await fetchFromAtlassian(
      this.setting.values.atlassian,
      url,
    )
    log(
      `${startAt + searchResult.issues.length} of total ${
        searchResult.total
      } issues were loaded`,
    )

    // create bits for each loaded issue
    const issues = await Promise.all(
      searchResult.issues.map(issue => this.createIssue(issue)),
    )

    // since we can only load max 100 issues per request, we check if we have more issues to load
    // then execute recursive call to load next 100 issues. Do it until we reach the end (total)
    if (searchResult.total > startAt + maxResults) {
      const nextPageIssues = await this.syncIssues(startAt + maxResults)
      return [...issues, ...nextPageIssues]
    }

    return issues
  }

  private createIssue(issue: JiraIssue): Promise<Bit> {
    const bitCreatedAt = new Date(issue.fields.created).getTime()
    const bitUpdatedAt = new Date(issue.fields.updated).getTime()

    return createOrUpdateBit(BitEntity, {
      integration: 'jira',
      identifier: issue.id,
      type: 'document',
      title: issue.fields.summary,
      body: issue.fields.description || '',
      data: issue,
      location: {
        id: issue.fields.project.id,
        name: issue.fields.project.name,
        webLink:
          this.setting.values.atlassian.domain +
          '/browse/' +
          issue.fields.project.key,
      },
      webLink: this.setting.values.atlassian.domain + '/browse/' + issue.key,
      author: issue.fields.creator.displayName,
      bitCreatedAt,
      bitUpdatedAt,
    })
  }
}
