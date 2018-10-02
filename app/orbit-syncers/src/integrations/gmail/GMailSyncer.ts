import { BitEntity, PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { BitUtils, PersonUtils } from '@mcro/model-utils'
import { Bit, GmailBitData, GmailBitDataParticipant, GmailPersonData, GmailSettingValues } from '@mcro/models'
import { GMailLoader, GmailThread } from '@mcro/services'
import { assign, hash, sequence } from '@mcro/utils'
import { getManager, getRepository, In } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { createOrUpdatePersonBits } from '../../utils/repository'
import { GMailMessageParser } from './GMailMessageParser'

export class GMailSyncer implements IntegrationSyncer {
  private log: Logger
  private setting: SettingEntity
  private loader: GMailLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.log = new Logger('syncer:gmail:' + setting.id)
    this.loader = new GMailLoader(setting)
  }

  async run() {
    let { historyId, max, monthLimit, filter, lastSyncMax, lastSyncFilter, lastSyncMonthLimit, whitelist } = this.setting
      .values as GmailSettingValues
    if (!max) max = 5000
    if (!monthLimit) monthLimit = 1

    this.log.info('sync settings', this.setting.values)

    // if max or filter has changed - we drop all bits we have and make complete sync again
    if (max !== lastSyncMax || filter !== lastSyncFilter || monthLimit !== lastSyncMonthLimit) {
      this.log.info(
        `last syncronization settings mismatch (max=${max}/${lastSyncMax}; filter=${filter}/${lastSyncFilter}; monthLimit=${monthLimit}/${lastSyncMonthLimit})`,
      )
      const truncatedBits = await getRepository(BitEntity).find({ settingId: this.setting.id }) // also need to filter by setting
      this.log.info('removing all bits', truncatedBits)
      await getRepository(BitEntity).remove(truncatedBits)
      this.log.info('bits were removed')
      historyId = null
    }

    let addedThreads: GmailThread[] = [],
      removedBits: Bit[] = []
    if (historyId) {
      // load history
      const history = await this.loader.loadHistory(historyId)
      historyId = history.historyId

      // load threads for newly added / changed threads
      if (history.addedThreadIds.length) {
        this.log.info(
          'loading all threads until we find following thread ids',
          history.addedThreadIds,
        )
        addedThreads = await this.loader.loadThreads(max, 0, filter, history.addedThreadIds)
      } else {
        this.log.info('no new messages in history were found')
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
      addedThreads = await this.loader.loadThreads(max, monthLimit, filter)
      historyId = addedThreads.length > 0 ? addedThreads[0].historyId : null
    }

    // load emails for whitelisted people separately
    if (whitelist) {
      const threadsFromWhiteList: GmailThread[] = []
      const whitelistEmails = Object
        .keys(whitelist)
        .filter(email => whitelist[email] === true)
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
      }
    }

    // if there are added threads then load messages and save their bits
    if (addedThreads.length) {
      this.log.timer('create new bits', addedThreads)
      const createdBits = await sequence(addedThreads, thread => this.createBit(thread))
      this.log.timer('create new bits', createdBits)
    }

    // if there are removed threads then remove their bits
    if (removedBits.length) {
      this.log.info('have a bits to be removed', removedBits)
      await getManager().remove(BitEntity, removedBits)
      this.log.info('bits were removed', removedBits)
    }

    // update settings
    const values = this.setting.values as GmailSettingValues
    values.historyId = historyId
    values.lastSyncFilter = filter
    values.lastSyncMonthLimit = monthLimit
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
          PersonUtils.create({
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

    const bit: Bit =
      (await getRepository(BitEntity).findOne(id, {
        relations: ['people'],
      })) || { target: 'bit' }

    const data: GmailBitData = {
      messages,
    }

    assign(
      bit,
      BitUtils.create({
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
