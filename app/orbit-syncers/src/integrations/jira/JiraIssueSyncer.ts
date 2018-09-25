import { BitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { JiraBitData, JiraSettingValues } from '@mcro/models'
import { JiraIssue, JiraLoader } from '@mcro/services'
import { assign, hash } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { BitUtils } from '@mcro/model-utils'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { SyncerUtils } from '../../core/SyncerUtils'

const log = new Logger('syncer:jira:issue')

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
    log.verbose('loading database bits')
    this.bits = await getRepository(BitEntity).find({
      settingId: this.setting.id,
    })
    log.verbose('database bits were loaded', this.bits)

    // load jira issues
    log.verbose('loading jira issues from the api')
    const issues = await this.loader.loadIssues()
    log.verbose('jira issues loaded', issues)

    // create bits from them and save them
    const bits = issues.map(issue => this.buildBit(issue))
    log.info('saving bits', bits)
    await getRepository(BitEntity).save(bits)
    log.verbose('bits where saved')

    // get a difference to find a removed bits
    const removedBits = BitUtils.difference(this.bits, bits)
    log.verbose('removing bits', removedBits)
    await getRepository(BitEntity).remove(removedBits)
    log.verbose('bits were removed')
  }

  /**
   * Builds a bit from the given jira issue.
   */
  private buildBit(issue: JiraIssue) {
    const id = hash(`jira-${this.setting.id}-${issue.id}`)
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
    if (issue.fields.assignee) peopleIds.push(issue.fields.assignee.accountId)
    if (issue.fields.creator) peopleIds.push(issue.fields.creator.accountId)
    if (issue.fields.reporter) peopleIds.push(issue.fields.reporter.accountId)

    const people = this.people.filter(person => {
      return peopleIds.indexOf(person.integrationId) !== -1
    })

    // find original content creator
    const author = this.people.find(person => {
      return person.integrationId === issue.fields.creator.accountId
    })

    // build the data property for this bit
    const data: JiraBitData = {
      content: cleanHtml,
    }

    // create or update a bit
    const bit = this.bits.find(bit => bit.id === id)
    return assign(
      bit || new BitEntity(),
      BitUtils.create({
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
          desktopLink: '',
        },
        webLink: domain + '/browse/' + issue.key,
        people,
        bitCreatedAt,
        bitUpdatedAt,
      }),
    )
  }
}
