import { BitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import {
  Bit,
  GmailBitData,
  GmailBitDataParticipant,
  GmailPersonData,
  GmailSettingValues,
  Person,
} from '@mcro/models'
import { GMailLoader, GmailThread } from '@mcro/services'
import { assign, hash, sequence } from '@mcro/utils'
import { getRepository, In } from 'typeorm'
import { createOrUpdatePersonBits } from '../../utils/repository'
import { BitSyncer } from '../../utils/BitSyncer'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { GMailMessageParser } from './GMailMessageParser'

const log = new Logger('syncer:gmail')

export class GMailSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: GMailLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GMailLoader(setting)
  }

  async run() {
    let { historyId, max, filter, lastSyncMax, lastSyncFilter, whitelist } = this.setting
      .values as GmailSettingValues
    if (!max) max = 50

    log.verbose('sync settings', {
      historyId,
      max,
      filter,
      lastSyncMax,
      lastSyncFilter,
      whitelist,
    })

    // if max or filter has changed - we drop all bits we have and make complete sync again
    if (max !== lastSyncMax || filter !== lastSyncFilter) {
      log.verbose(
        `last syncronization settings mismatch (max=${max}/${lastSyncMax}; filter=${filter}/${lastSyncFilter})`,
      )
      const truncatedBits = await getRepository(BitEntity).find({ settingId: this.setting.id }) // also need to filter by setting
      log.verbose('removing all bits', truncatedBits)
      await getRepository(BitEntity).remove(truncatedBits)
      log.verbose('bits were removed')
      historyId = null
    }

    let addedThreads: GmailThread[] = [],
      removedBits: BitEntity[] = []
    if (historyId) {
      // load history
      const history = await this.loader.loadHistory(historyId)
      historyId = history.historyId

      // load threads for newly added / changed threads
      if (history.addedThreadIds.length) {
        log.verbose(
          'loading all threads until we find following thread ids',
          history.addedThreadIds,
        )
        addedThreads = await this.loader.loadThreads(max, filter, history.addedThreadIds)
      } else {
        log.verbose('no new messages in history were found')
      }

      // load bits for removed threads
      if (history.removedThreadIds.length) {
        log.verbose('found actions in history for thread removals', history.removedThreadIds)
        removedBits = await getRepository(BitEntity).find({
          settingId: this.setting.id,
          id: In(history.removedThreadIds),
        })
        log.verbose('found bits to be removed', removedBits)
      } else {
        log.verbose('no removed messages in history were found')
      }
    } else {
      addedThreads = await this.loader.loadThreads(max, filter)
      historyId = addedThreads.length > 0 ? addedThreads[0].historyId : null
    }

    // load emails for whitelisted people separately
    if (whitelist) {
      log.verbose('loading threads from whitelisted people')
      const threadsFromWhiteList: GmailThread[] = []
      await Promise.all(
        Object.keys(whitelist).map(async email => {
          if (whitelist[email] === false) return

          const threads = await this.loader.loadThreads(max, `from:${email}`)
          const nonDuplicateThreads = threads.filter(thread => {
            return addedThreads.some(addedThread => addedThread.id === thread.id)
          })
          threadsFromWhiteList.push(...nonDuplicateThreads)
        }),
      )
      addedThreads.push(...threadsFromWhiteList)
      log.verbose('whitelisted people threads loaded', threadsFromWhiteList)
    }

    // if there are added threads then load messages and save their bits
    if (addedThreads.length) {
      log.verbose('have a threads to be added/changed', addedThreads)
      await this.loader.loadMessages(addedThreads)
      const createdBits = await sequence(addedThreads, thread => this.createBit(thread))
      log.info('bits were created / updated', createdBits)
    }

    // if there are removed threads then remove their bits
    if (removedBits.length) {
      log.verbose('have a bits to be removed', removedBits)
      await getRepository(BitEntity).remove(removedBits)
      log.info('bits were removed', removedBits)
    }

    // update settings
    const values = this.setting.values as GmailSettingValues
    values.historyId = historyId
    values.lastSyncFilter = filter
    values.lastSyncMax = max
    await getRepository(SettingEntity).save(this.setting)
  }

  private async createBit(thread: GmailThread): Promise<Bit> {
    const id = hash(`gmail-${this.setting.id}-${thread.id}`)

    const body = thread.messages
      .map(message => {
        const parser = new GMailMessageParser(message)
        return parser.getTextBody()
      })
      .join('\r\n\r\n')

    const messages = await Promise.all(
      thread.messages.map(async message => {
        const parser = new GMailMessageParser(message)
        return {
          id: message.id,
          date: parser.getDate(),
          body: parser.getHtmlBody(),
          participants: parser.getParticipants(),
        }
      }),
    )

    const allParticipants = thread.messages.reduce(
      (allParticipants, message) => {
        const parser = new GMailMessageParser(message)
        const participants = parser.getParticipants()
        for (let participant of participants) {
          const inAllParticipant = allParticipants.find(p => p.email === participant.email)
          if (inAllParticipant) {
            if (!inAllParticipant.name && participant.name) inAllParticipant.name = participant.name
          } else {
            allParticipants.push(participant)
          }
        }
        return allParticipants
      },
      [] as GmailBitDataParticipant[],
    )

    const people = await Promise.all(
      allParticipants.map(async participant => {
        const { name, email } = participant

        const id = hash(`gmail-${this.setting.id}-${email}`)
        const person = (await getRepository(PersonEntity).findOne(id)) || new PersonEntity()
        const data: GmailPersonData = {}

        Object.assign(
          person,
          PersonSyncer.create({
            id,
            integrationId: email,
            integration: 'gmail',
            name: name || '',
            settingId: this.setting.id,
            webLink: 'mailto:' + email,
            desktopLink: 'mailto:' + email,
            email: email,
            data,
            raw: participant,
          }),
        )
        await getRepository(PersonEntity).save(person)

        return person
      }),
    )

    const firstMessage = thread.messages[0]
    const lastMessage = thread.messages[thread.messages.length - 1]
    const firstMessageParser = new GMailMessageParser(firstMessage)
    const lastMessageParser = new GMailMessageParser(lastMessage)

    const bit =
      (await getRepository(BitEntity).findOne(id, {
        relations: ['people'],
      })) || new BitEntity()

    const data: GmailBitData = {
      messages,
    }

    assign(
      bit,
      BitSyncer.create({
        target: 'bit',
        id,
        integration: 'gmail',
        type: 'mail',
        title: firstMessageParser.getTitle(),
        body,
        data,
        raw: thread,
        bitCreatedAt: firstMessageParser.getDate(),
        bitUpdatedAt: lastMessageParser.getDate(),
        webLink: 'https://mail.google.com/mail/u/0/#inbox/' + thread.id,
        settingId: this.setting.id,
      }),
    )

    // adding bit people
    if (!bit.people) bit.people = []

    people.forEach(person => {
      const hasSuchPerson = bit.people.some(bitPerson => {
        return bitPerson.id === person.id
      })
      if (!hasSuchPerson) bit.people.push(person)
    })

    await getRepository(BitEntity).save(bit)
    await createOrUpdatePersonBits(people)
    return bit
  }
}
