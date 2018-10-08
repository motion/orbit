import { BitEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { chunk } from 'lodash'
import { Bit, GmailBitDataParticipant, GmailSettingValues, Person, Setting } from '@mcro/models'
import { GMailLoader, GMailThread } from '@mcro/services'
import { getRepository, In } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { SyncerRepository } from '../../utils/SyncerRepository'
import { GMailBitFactory } from './GMailBitFactory'
import { GMailMessageParser } from './GMailMessageParser'
import { GMailPersonFactory } from './GMailPersonFactory'

/**
 * Syncs GMail.
 */
export class GMailSyncer implements IntegrationSyncer {
  private log: Logger
  private setting: Setting
  private loader: GMailLoader
  private bitFactory: GMailBitFactory
  private personFactory: GMailPersonFactory
  private personSyncer: PersonSyncer
  private bitSyncer: BitSyncer
  private syncerRepository: SyncerRepository

  constructor(setting: Setting, log?: Logger) {
    this.setting = setting
    this.log = log || new Logger('syncer:gmail:' + setting.id)
    this.loader = new GMailLoader(setting, this.log)
    this.bitFactory = new GMailBitFactory(setting)
    this.personFactory = new GMailPersonFactory(setting)
    this.personSyncer = new PersonSyncer(setting, this.log)
    this.bitSyncer = new BitSyncer(setting, this.log)
    this.syncerRepository = new SyncerRepository(setting)
  }

  async run() {
    this.log.info('sync settings', this.setting.values)

    const values = this.setting.values as GmailSettingValues
    let dropAllBits = false
    let { historyId, max, daysLimit, filter } = values
    if (!max) max = 10000
    if (!daysLimit) daysLimit = 30
    filter = filter ? filter : `newer_than:${daysLimit}d`

    // if max or filter has changed - we drop all bits and make complete sync again
    if ((values.lastSyncMax !== undefined && max !== values.lastSyncMax) ||
        (values.lastSyncFilter !== undefined && filter !== values.lastSyncFilter) ||
        (values.lastSyncDaysLimit !== undefined && daysLimit !== values.lastSyncDaysLimit)) {
      this.log.info(`last syncronization settings mismatch, need to drop all integration bits and start a clean history`)
      dropAllBits = true
      historyId = null
    }

    let addedThreads: GMailThread[] = [], removedBits: Bit[] = []
    if (historyId) {
      // load history
      const history = await this.loader.loadHistory(historyId)
      historyId = history.historyId

      // load threads for newly added / changed threads
      if (history.addedThreadIds.length) {
        this.log.timer('load all threads until we find following thread ids', history.addedThreadIds)
        addedThreads = await this.loader.loadThreads(max, 0, filter, history.addedThreadIds)
        this.log.timer('load all threads until we find following thread ids', addedThreads)
      } else {
        this.log.info('no added / changed messages in history were found')
      }

      // load bits for removed threads
      if (history.removedThreadIds.length) {
        this.log.info('found actions in history for thread removals', history.removedThreadIds)
        removedBits = await getRepository(BitEntity).find({
          settingId: this.setting.id,
          id: In(history.removedThreadIds),
        })
        this.log.info('found bits to be removed', removedBits)
      } else {
        this.log.info('no removed messages in history were found')
      }
    } else {
      this.log.timer('load all threads', { max, daysLimit, filter })
      addedThreads = await this.loader.loadThreads(max, filter)
      historyId = addedThreads.length > 0 ? addedThreads[0].historyId : null
      this.log.timer('load all threads', addedThreads)
    }

    // load emails for whitelisted people separately
    if (values.whitelist) {
      this.log.info(`checking whitelist`, values.whitelist)
      const threadsFromWhiteList: GMailThread[] = []
      const whitelistEmails = Object
        .keys(values.whitelist)
        .filter(email => values.whitelist[email] === true)

      if (whitelistEmails.length > 0) {
        this.log.info('loading threads from whitelisted people', whitelistEmails)
        // we split emails into chunks because gmail api can't handle huge queries
        const emailChunks = chunk(whitelistEmails, 100)
        for (let emails of emailChunks) {
          const whitelistFilter = emails.map(email => "from:" + email).join(" OR ")
          const threads = await this.loader.loadThreads(max, 0, whitelistFilter)
          const nonDuplicateThreads = threads.filter(thread => {
            return addedThreads.some(addedThread => addedThread.id === thread.id)
          })
          threadsFromWhiteList.push(...nonDuplicateThreads)
          addedThreads.push(...threadsFromWhiteList)
        }
        this.log.info('whitelisted people threads loaded', threadsFromWhiteList)
      } else {
        this.log.info(`no enabled people in whitelist were found`)
      }
    }

    this.log.timer('create bits from new threads', addedThreads)
    const apiBits: Bit[] = [], apiPeople: Person[] = []
    for (let thread of addedThreads) {
      const participants = this.extractThreadParticipants(thread)
      const bit = this.bitFactory.create(thread)
      bit.people = participants.map(participant => this.personFactory.create(participant))
      apiBits.push(bit)
      apiPeople.push(...bit.people)
    }
    this.log.timer('create bits from new threads', { apiBits, apiPeople })

    const personIds = apiPeople.map(person => person.id)
    const bitIds = apiBits.map(bit => bit.id)

    this.log.timer(`load people, person bits and bits from the database`, {
      personIds,
      bitIds,
    })
    const dbPeople = personIds.length ? await this.syncerRepository.loadDatabasePeople({ ids: personIds }) : []
    const dbPersonBits = apiPeople.length ? await this.syncerRepository.loadDatabasePersonBits({ people: apiPeople }) : []
    const dbBits = bitIds.length ? await this.syncerRepository.loadDatabaseBits({ ids: bitIds }) : []
    this.log.timer(`load people, person bits and bits from the database`, {
      dbPeople,
      dbPersonBits,
      dbBits,
    })

    // sync people and bits
    await this.personSyncer.sync({ apiPeople, dbPeople, dbPersonBits })
    await this.bitSyncer.sync({ apiBits, dbBits, dropAllBits, removedBits })

    // update settings
    this.log.info('updating sync settings')
    values.historyId = historyId
    values.lastSyncFilter = filter
    values.lastSyncDaysLimit = daysLimit
    values.lastSyncMax = max
    await getRepository(SettingEntity).save(this.setting)
  }

  /**
   * Extracts all participants from a given gmail threads.
   */
  private extractThreadParticipants(thread: GMailThread): GmailBitDataParticipant[] {
    const allParticipants: GmailBitDataParticipant[] = []
    for (let message of thread.messages) {
      const parser = new GMailMessageParser(message)
      const participants = parser.getParticipants()
      for (let participant of participants) {
        const inAllParticipant = allParticipants.find(p => p.email === participant.email)
        if (inAllParticipant) {
          if (!inAllParticipant.name && participant.name)
            inAllParticipant.name = participant.name
        } else {
          allParticipants.push(participant)
        }
      }
    }
    return allParticipants
  }

}
