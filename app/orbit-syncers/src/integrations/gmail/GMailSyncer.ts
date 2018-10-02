import { BitEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Bit, GmailSettingValues, Setting } from '@mcro/models'
import { GmailBitDataParticipant, Person } from '@mcro/models'
import { GMailLoader, GMailThread } from '@mcro/services'
import { hash } from '@mcro/utils'
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

  constructor(setting: Setting) {
    this.setting = setting
    this.log = new Logger('syncer:gmail:' + setting.id)
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
    let { historyId, max, monthLimit, filter } = values
    if (!max) max = 5000
    if (!monthLimit) monthLimit = 1
    let dropAllBits = false

    // if max or filter has changed - we drop all bits and make complete sync again
    if ((values.lastSyncMax !== undefined && max !== values.lastSyncMax) ||
        (values.lastSyncFilter !== undefined && filter !== values.lastSyncFilter) ||
        (values.lastSyncMonthLimit !== undefined && monthLimit !== values.lastSyncMonthLimit)) {
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
      this.log.timer('load all threads', { max, monthLimit, filter })
      addedThreads = await this.loader.loadThreads(max, monthLimit, filter)
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
      const whitelistFilter = whitelistEmails.map(email => "from:" + email).join(" OR ")

      if (whitelistFilter) {
        this.log.info('loading threads from whitelisted people', whitelistEmails, whitelistFilter)
        const threads = await this.loader.loadThreads(max, 0, whitelistFilter)
        const nonDuplicateThreads = threads.filter(thread => {
          return addedThreads.some(addedThread => addedThread.id === thread.id)
        })
        threadsFromWhiteList.push(...nonDuplicateThreads)
        addedThreads.push(...threadsFromWhiteList)
        this.log.info('whitelisted people threads loaded', threadsFromWhiteList)
      } else {
        this.log.info(`no enabled people in whitelist were found`)
      }
    }

    this.log.info('create bits from new threads', addedThreads)
    const apiBits: Bit[] = [], apiPeople: Person[] = []
    for (let thread of addedThreads) {
      const participants = this.extractThreadParticipants(thread)
      const bit = this.bitFactory.create(thread)
      bit.people = participants.map(participant => this.personFactory.create(participant))
      apiBits.push(bit)
      apiPeople.push(...bit.people)
    }

    const personIds = apiPeople.map(person => person.id)
    const personBitIds = apiPeople.map(person => hash(person.email))
    const bitIds = apiBits.map(bit => bit.id)

    this.log.timer(`load people, person bits and bits from the database`, {
      apiPeople,
      apiBits,
      personIds,
      personBitIds,
      bitIds,
    })
    const dbPeople = personIds.length ? await this.syncerRepository.loadDatabasePeople(personIds) : []
    const dbPersonBits = personBitIds.length ? await this.syncerRepository.loadDatabasePersonBits(personBitIds) : []
    const dbBits = bitIds.length ? await this.syncerRepository.loadDatabaseBits(bitIds) : []
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
    values.lastSyncMonthLimit = monthLimit
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
