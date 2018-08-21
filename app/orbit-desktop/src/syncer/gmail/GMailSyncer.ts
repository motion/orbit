import { logger } from '@mcro/logger'
import { Bit, GmailBitDataParticipant, Person } from '@mcro/models'
import { getManager, getRepository, In } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import * as Helpers from '../../helpers'
import { createOrUpdatePersonBits } from '../../repository'
import { assign, sequence } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GMailLoader } from './GMailLoader'
import { GMailMessageParser } from './GMailMessageParser'
import { GmailThread } from './GMailTypes'

const log = logger('syncer:gmail')

export class GMailSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: GMailLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GMailLoader(setting)
  }

  async run() {
    let {
      historyId,
      max,
      filter,
      lastSyncMax,
      lastSyncFilter,
      whiteList,
    } = this.setting.values
    if (!max) max = 50

    log('sync settings', {
      historyId,
      max,
      filter,
      lastSyncMax,
      lastSyncFilter,
      whiteList,
    })

    // if max or filter has changed - we drop all bits we have and make complete sync again
    if (max !== lastSyncMax || filter !== lastSyncFilter) {
      log(
        `last syncronization settings mismatch (max=${max}/${lastSyncMax}; filter=${filter}/${lastSyncFilter})`,
      )
      const truncatedBits = await BitEntity.find({ integration: 'gmail' }) // also need to filter by setting
      log(`removing all bits`, truncatedBits)
      await BitEntity.remove(truncatedBits)
      log(`bits were removed`)
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
        log(
          `loading all threads until we find following thread ids`,
          history.addedThreadIds,
        )
        addedThreads = await this.loader.loadThreads(
          max,
          this.setting.values.filter,
          history.addedThreadIds,
        )
      } else {
        log(`no new messages in history were found`)
      }

      // load bits for removed threads
      if (history.removedThreadIds.length) {
        log(
          'found actions in history for thread removals',
          history.removedThreadIds,
        )
        removedBits = await BitEntity.find({
          integration: 'gmail',
          id: In(history.removedThreadIds),
        })
        log('found bits to be removed', removedBits)
      } else {
        log(`no removed messages in history were found`)
      }
    } else {
      addedThreads = await this.loader.loadThreads(max, this.setting.values.filter)
      historyId = addedThreads.length > 0 ? addedThreads[0].historyId : null
    }

    // load emails for whitelisted people separately
    if (whiteList) {
      log(`loading threads from whitelisted people`)
      const threadsFromWhiteList: GmailThread[] = []
      await Promise.all(Object.keys(whiteList).map(async email => {
        if (whiteList[email] === false)
          return

        const threads = await this.loader.loadThreads(max, `from:${email}`)
        const nonDuplicateThreads = threads.filter(thread => {
          return addedThreads.some(addedThread => addedThread.id === thread.id)
        })
        threadsFromWhiteList.push(...nonDuplicateThreads)
      }))
      addedThreads.push(...threadsFromWhiteList)
      log(`whitelisted people threads loaded`, threadsFromWhiteList)
    }

    // if there are added threads then load messages and save their bits
    if (addedThreads.length) {
      log(`have a threads to be added/changed`, addedThreads)
      await this.loader.loadMessages(addedThreads)
      const createdBits = await sequence(addedThreads, thread => this.createBit(thread))
      log('bits were created / updated', createdBits)
    }

    // if there are removed threads then remove their bits
    if (removedBits.length) {
      log(`have a bits to be removed`, removedBits)
      await BitEntity.remove(removedBits)
      log('bits were removed')
    }

    // update settings
    // this.setting.values.historyId = historyId
    // this.setting.values.lastSyncFilter = filter
    // this.setting.values.lastSyncMax = max
    await this.setting.save()
  }

  private async createBit(thread: GmailThread): Promise<Bit> {

    const id = `gmail-${this.setting.id}-${thread.id}`
    
    const body = thread.messages.map(message => {
      const parser = new GMailMessageParser(message)
      return parser.getTextBody()
    }).join('\r\n\r\n')

    const messages = await Promise.all(thread.messages.map(async message => {
      const parser = new GMailMessageParser(message)
      return {
        id: message.id,
        date: parser.getDate(),
        body: parser.getHtmlBody(),
        participants: parser.getParticipants(),
      }
    }))

    const allParticipants = thread.messages.reduce((allParticipants, message) => {
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
      return allParticipants
    }, [] as GmailBitDataParticipant[])

    const people = await Promise.all(allParticipants.map(async participant => {
      const {name, email} = participant

      const id = `gmail-${this.setting.id}-${Helpers.hash(email)}`
      const person = (await getRepository(PersonEntity).findOne(id)) || new PersonEntity()
      assign(person, {
        id,
        integrationId: email,
        integration: 'gmail',
        name: name || '',
        settingId: this.setting.id,
        webLink: 'mailto:' + email,
        desktopLink: 'mailto:' + email,
        email: email
      })
      await getRepository(PersonEntity).save(person)

      return person
    }))

    const firstMessage = thread.messages[0]
    const lastMessage = thread.messages[thread.messages.length - 1]
    const firstMessageParser = new GMailMessageParser(firstMessage)
    const lastMessageParser = new GMailMessageParser(lastMessage)

    const bit = (await getRepository(BitEntity).findOne(id, {
        relations: ['people'],
      })) || new BitEntity()

    assign(bit, {
      target: 'bit',
      id,
      integration: 'gmail',
      type: 'mail',
      title: firstMessageParser.getTitle(),
      body,
      data: { messages },
      raw: thread,
      bitCreatedAt: firstMessageParser.getDate(),
      bitUpdatedAt: lastMessageParser.getDate(),
      webLink: `https://mail.google.com/mail/u/0/#inbox/` + thread.id,
      settingId: this.setting.id,
    })

    // adding bit people
    if (!bit.people)
      bit.people = []

    people.forEach(person => {
      const hasSuchPerson = bit.people.some(bitPerson => {
        return bitPerson.id === person.id
      })
      if (!hasSuchPerson)
        bit.people.push(person)
    })

    await getRepository(BitEntity).save(bit)
    await createOrUpdatePersonBits(people)
    return bit
  }

}
