import { logger } from '@mcro/logger'
import { Bit, JiraBitData } from '@mcro/models'
import { JiraSettingValues } from '@mcro/models'
import { getRepository } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { assign } from '../../utils'
import { BitUtils } from '../../utils/BitUtils'
import { SyncerUtils } from '../core/SyncerUtils'
import { JiraLoader } from './JiraLoader'
import { JiraIssue } from './JiraTypes'

const log = logger('syncer:jira:issue')

/**
 * Syncs Jira issues.
 */
export class JiraIssueSyncer implements IntegrationSyncer {

  private setting: SettingEntity
  private loader: JiraLoader
  private people: PersonEntity[]
  private bits: BitEntity[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new JiraLoader(setting)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {

    // load database people first
    this.people = await SyncerUtils.loadPeople(this.setting.id, log)

    // load all database bits
    log(`loading database bits`)
    this.bits = await getRepository(BitEntity).find({
      settingId: this.setting.id,
    })
    log(`database bits were loaded`, this.bits)

    // load jira issues
    log(`loading jira issues from the api`)
    const issues = await this.loader.loadIssues()
    log(`jira issues loaded`, issues)

    // create bits from them and save them
    const bits = issues.map(issue => this.buildBit(issue))
    log(`saving bits`, bits)
    await getRepository(BitEntity).save(bits)
    log(`bits where saved`)

    // get a difference to find a removed bits
    const removedBits = BitUtils.difference(this.bits, bits)
    log(`removing bits`, removedBits)
    await getRepository(BitEntity).remove(removedBits)
    log(`bits were removed`)
  }

  /**
   * Builds a bit from the given jira issue.
   */
  private buildBit(issue: JiraIssue) {

    const id = `jira-${this.setting.id}-${issue.id}`
    const bitCreatedAt = new Date(issue.fields.created).getTime()
    const bitUpdatedAt = new Date(issue.fields.updated).getTime()
    const values = this.setting.values as JiraSettingValues
    const domain = values.credentials.domain
    const body = SyncerUtils.stripHtml(issue.renderedFields.description)
    const cleanHtml = SyncerUtils.sanitizeHtml(issue.renderedFields.description)

    // get people contributed to this bit (content author, editors, commentators)
    const peopleIds = []
    if (issue.fields.comment)
      peopleIds.push(...issue.comments.map(comment => comment.author.accountId))
    if (issue.fields.assignee)
      peopleIds.push(issue.fields.assignee.accountId)
    if (issue.fields.creator)
      peopleIds.push(issue.fields.creator.accountId)
    if (issue.fields.reporter)
      peopleIds.push(issue.fields.reporter.accountId)

    const people = this.people.filter(person => {
      return peopleIds.indexOf(person.integrationId) !== -1
    })

    // find original content creator
    const author = this.people.find(person => {
      return person.integrationId === issue.fields.creator.accountId
    })

    // build the data property for this bit
    const data: JiraBitData = {
      content: cleanHtml
    }

    // create or update a bit
    const bit = this.bits.find(bit => bit.id === id)
    return assign(bit || new BitEntity(), {
      integration: 'jira',
      id,
      setting: this.setting,
      type: 'document',
      title: issue.fields.summary,
      body,
      author,
      data,
      raw: issue,
      location: {
        id: issue.fields.project.id,
        name: issue.fields.project.name,
        webLink: domain + '/browse/' + issue.fields.project.key,
        desktopLink: ''
      },
      webLink: domain + '/browse/' + issue.key,
      people,
      bitCreatedAt,
      bitUpdatedAt,
    })
  }

}
