import { Bit, Person } from '@mcro/models'
import { getManager, getRepository, In } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import * as Helpers from '../../helpers'
import { createOrUpdate } from '../../helpers/createOrUpdate'
import { createOrUpdateBit } from '../../helpers/createOrUpdateBit'
import { createOrUpdatePersonBit } from '../../repository'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { sequence } from '../../utils'
import { GMailLoader } from './GMailLoader'
import {
  parseMailDate,
  parseMailTitle,
  parseSender,
} from './GMailMessageParser'
import { GmailThread } from './GMailTypes'
import { SettingEntity } from '../../entities/SettingEntity'
import { logger } from '@motion/logger'

const log = logger('syncer:gmail')

export class GMailSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: GMailLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GMailLoader(setting)
  }

  async run() {
    await this.syncMail()
  }

  async reset(): Promise<void> {

    // todo: this logic should be extracted into separate place where settings managed
    // get entities for removal / updation
    const bits = await getRepository(BitEntity).find({ settingId: this.setting.id })
    const people = await getRepository(PersonEntity).find({ settingId: this.setting.id })

    // remove entities
    log(`removing ${bits.length} bits and ${people.length} people`, bits, people)
    await getManager().remove([...bits, ...people])
    log(`people were removed`)

    // reset settings
    this.setting.values.historyId = null
    this.setting.values.lastSyncFilter = null
    this.setting.values.lastSyncMax = null
    await getRepository(SettingEntity).save(this.setting)
  }

  private async syncMail() {
    let {
      historyId,
      max,
      filter,
      lastSyncMax,
      lastSyncFilter,
    } = this.setting.values
    if (!max) max = 50
    log('sync settings', {
      historyId,
      max,
      filter,
      lastSyncMax,
      lastSyncFilter,
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
          identifier: In(history.removedThreadIds),
        })
        log('found bits to be removed', removedBits)
      } else {
        log(`no removed messages in history were found`)
      }
    } else {
      addedThreads = await this.loader.loadThreads(max)
      historyId = addedThreads.length > 0 ? addedThreads[0].historyId : null
    }

    // if there are added threads then load messages and save their bits
    if (addedThreads.length) {
      log(`have a threads to be added/changed`, addedThreads)
      await this.loader.loadMessages(addedThreads)
      const createdPeople = await this.createPeople(addedThreads)
      const createdBits = await this.createBits(addedThreads)
      log('bits were created / updated', createdBits, createdPeople)
    }

    // if there are removed threads then remove their bits
    if (removedBits.length) {
      log(`have a bits to be removed`, removedBits)
      await BitEntity.remove(removedBits)
      log('bits were removed')
    }

    // update settings
    this.setting.values.historyId = historyId
    this.setting.values.lastSyncFilter = filter
    this.setting.values.lastSyncMax = max
    // @ts-ignore
    await this.setting.save()
  }

  private async createBits(threads: GmailThread[]): Promise<Bit[]> {
    return Promise.all(
      threads.map(thread => {
        return createOrUpdateBit(BitEntity, {
          identifier: thread.id,
          integration: 'gmail',
          type: 'mail',
          title: parseMailTitle(thread.messages[0]) || '',
          body: '',
          data: thread,
          bitCreatedAt: parseMailDate(thread.messages[0]),
          bitUpdatedAt: parseMailDate(
            thread.messages[thread.messages.length - 1],
          ),
          webLink: `https://mail.google.com/mail/u/0/#inbox/` + thread.id,
          settingId: this.setting.id,
        })
      }),
    )
  }

  private async createPeople(threads: GmailThread[]): Promise<Person[]> {
    const people: Person[] = []
    await sequence(threads, thread => {
      return sequence(thread.messages, async message => {
        const [name, email] = parseSender(message)
        if (name && email) {
          const identifier = `gmail-${Helpers.hash({ name, email })}`
          const person = await createOrUpdate(
            PersonEntity,
            {
              identifier,
              integrationId: email,
              integration: 'gmail',
              name: name,
              settingId: this.setting.id
            },
            { matching: ['identifier', 'integration'] },
          )

          await createOrUpdatePersonBit({
            email,
            name,
            identifier,
            integration: 'gmail',
            person,
          })
        }
      })
    })
    return people
  }
}
