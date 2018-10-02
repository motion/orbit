import { BitEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { BitUtils } from '@mcro/model-utils'
import { Bit, ConfluenceBitData, ConfluenceSettingValues, Person } from '@mcro/models'
import { ConfluenceContent, ConfluenceLoader } from '@mcro/services'
import { assign, hash } from '@mcro/utils'
import { getManager, getRepository } from 'typeorm'
import { SyncerUtils } from '../../core/SyncerUtils'

const log = new Logger('syncer:confluence:content')

/**
 * Syncs Confluence pages and blogs.
 */
export class ConfluenceSyncer {
  private setting: SettingEntity
  private loader: ConfluenceLoader
  private people: Person[]
  private bits: Bit[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new ConfluenceLoader(setting)
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

    // load pages
    log.verbose('loading content from the api')
    const contents = await this.loader.loadContents()

    // create bits from them and save them
    const bits = contents.map(content => this.buildBit(content))
    log.info('saving bits', bits)
    await getRepository(BitEntity).save(bits)
    log.verbose('bits were saved')

    // get a difference to find a removed bits and remove them
    const removedBits = BitUtils.difference(this.bits, bits)
    log.verbose('removing bits', removedBits)
    await getManager().remove(BitEntity, removedBits)
    log.verbose('bits were removed')
  }

  /**
   * Builds a bit from the given confluence content.
   */
  private buildBit(content: ConfluenceContent): Bit {
    const values = this.setting.values as ConfluenceSettingValues
    const domain = values.credentials.domain
    const id = hash(`confluence-${this.setting.id}-${content.id}`)
    const bitCreatedAt = new Date(content.history.createdDate).getTime()
    const bitUpdatedAt = new Date(content.history.lastUpdated.when).getTime()
    const body = SyncerUtils.stripHtml(content.body.styled_view.value)
    let cleanHtml = SyncerUtils.sanitizeHtml(content.body.styled_view.value)
    const matches = content.body.styled_view.value.match(
      /<style default-inline-css>((.|\n)*)<\/style>/gi,
    )
    if (matches) cleanHtml = matches[0] + cleanHtml

    // get people contributed to this bit (content author, editors, commentators)
    const peopleIds = [
      content.history.createdBy.accountId,
      ...content.comments.map(comment => comment.history.createdBy.accountId),
      ...content.history.contributors.publishers.userAccountIds,
    ]
    const people = this.people.filter(person => {
      return peopleIds.indexOf(person.integrationId) !== -1
    })

    // find original content creator
    const author = this.people.find(person => {
      return person.integrationId === content.history.createdBy.accountId
    })

    // build the data property for this bit
    const data: ConfluenceBitData = {
      content: cleanHtml,
    }

    // create or update a bit
    const bit = this.bits.find(bit => bit.id === id)
    return assign(
      (bit || { target: 'bit' }) as Bit,
      BitUtils.create({
        integration: 'confluence',
        id,
        setting: this.setting,
        type: 'document',
        title: content.title,
        body,
        data,
        author,
        raw: content,
        location: {
          id: content.space.id,
          name: content.space.name,
          webLink: domain + '/wiki' + content.space._links.webui,
          desktopLink: '',
        },
        webLink: domain + '/wiki' + content._links.webui,
        people,
        bitCreatedAt,
        bitUpdatedAt,
      }),
    )
  }
}
