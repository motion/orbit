import { logger } from '@mcro/logger'
import { Bit, Person } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import { getRepository } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { assign } from '../../utils'
import { BitUtils } from '../../utils/BitUtils'
import { SyncerUtils } from '../core/SyncerUtils'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceContent } from './ConfluenceTypes'
import { ConfluenceUtils } from './ConfluenceUtils'

const log = logger('syncer:confluence:content')

export class ConfluenceContentSyncer {

  private setting: SettingEntity
  private loader: ConfluenceLoader
  private people: PersonEntity[]
  private bits: BitEntity[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new ConfluenceLoader(setting)
  }

  async run(): Promise<void> {

    // load people first
    this.people = await SyncerUtils.loadPeople(this.setting.id, log)

    // load all database bits
    this.bits = await getRepository(BitEntity).find({
      settingId: this.setting.id
    })

    // load pages
    console.log(`loading content from the api`)
    const contents = await this.loader.loadContents()
    console.log(`content loaded`, contents)

    // create bits from them and save them
    const bits = contents.map(content => this.createIssue(content))
    log(`saving bits`, bits)
    await getRepository(BitEntity).save(bits)
    log(`bits where saved`)

    // get a difference to find a removed bits
    const removedBits = BitUtils.difference(this.bits, bits)
    log(`removing bits`, removedBits)
    await getRepository(BitEntity).remove(removedBits)
    log(`bits were removed`)
  }

  private createIssue(content: ConfluenceContent) {

    const id = `confluence-${this.setting.id}-${content.id}`
    const bitCreatedAt = new Date(content.history.createdDate).getTime()
    const bitUpdatedAt = new Date(content.history.lastUpdated.when).getTime()
    const markdownBody = ConfluenceUtils.contentHtmlToMarkdown(content.body.storage.value)
    const body = markdownBody.replace(/\s\s+/g, ' ')
    const author = content.history.createdBy.displayName ||
      content.history.createdBy.username
    const personId = `confluence-${this.setting.id}-${content.history.createdBy.accountId}`
    const person = this.people.find(person => person.id === personId)
    const bit = this.bits.find(bit => bit.id === id)
    const people = person ? [person] : []

    return assign(bit || new BitEntity(), {
      integration: 'confluence',
      id,
      setting: this.setting,
      type: 'document',
      title: content.title,
      body,
      data: {
        ...content,
        markdownBody,
        author,
      } as any,
      location: {
        id: content.space.id,
        name: content.space.name,
        webLink: content._links.base + content.space._links.webui,
        desktopLink: ''
      },
      webLink: content._links.base + content._links.webui,
      people,
      bitCreatedAt,
      bitUpdatedAt,
    })
  }

}
