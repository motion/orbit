import { PersonBitEntity, PersonEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { PersonBitUtils } from '@mcro/model-utils'
import { Person, PersonBit, Setting } from '@mcro/models'
import { uniqBy } from 'lodash'
import { getManager } from 'typeorm'
import { SyncerRepository } from './SyncerRepository'
import { hash } from '@mcro/utils'

/**
 * Sync Person options.
 */
export interface PersonSyncerOptions {
  apiPeople: Person[]
  dbPeople: Person[]
  dbPersonBits: PersonBit[]
}

/**
 * Syncs Person.
 */
export class PersonSyncer {
  private log: Logger
  private syncerRepository: SyncerRepository

  constructor(setting: Setting, log: Logger) {
    this.log = log
    this.syncerRepository = new SyncerRepository(setting)
  }

  /**
   * Syncs given people in the database.
   * Returns saved (inserted and updated) people.
   */
  async sync(options: PersonSyncerOptions): Promise<Person[]> {
    this.log.info(`syncing people and person bits`, options)
    let { apiPeople, dbPeople, dbPersonBits } = options

    // filter out people, left only unique people
    apiPeople = uniqBy(apiPeople, person => person.id)
    dbPeople = uniqBy(dbPeople, person => person.id)

    // for people without emails we create "virtual" email
    for (let person of apiPeople) {
      if (!person.email) {
        person.email = person.name + ' from ' + person.integration
      }
    }

    // calculate people that we need to update in the database
    this.log.timer(`calculating people change set`)
    const insertedPeople = apiPeople.filter(apiPerson => {
      return !dbPeople.some(dbPerson => dbPerson.id === apiPerson.id)
    })
    const updatedPeople = apiPeople.filter(apiPerson => {
      const dbPerson = dbPeople.find(dbPerson => dbPerson.id === apiPerson.id)
      return dbPerson && dbPerson.contentHash !== apiPerson.contentHash
    })
    const removedPeople = dbPeople.filter(dbPerson => {
      return !apiPeople.some(apiPerson => apiPerson.id === dbPerson.id)
    })
    const savedPeople = [...updatedPeople, ...insertedPeople]
    this.log.timer(`calculating people change set`, { insertedPeople, updatedPeople, removedPeople })

    // calculate people bits that we need to update in the database
    this.log.timer(`calculating person bits change set`)
    const insertedPersonBits = [], updatedPersonBits = []
    for (let person of savedPeople) {

      // create a person bit from synced person, load database person bit and merge them
      const id = hash(person.email)
      const dbPersonBit = dbPersonBits.find(personBit => personBit.id === id)
      const newPersonBit = PersonBitUtils.createFromPerson(person)
      const personBit = PersonBitUtils.merge(newPersonBit, dbPersonBit || {})

      // push person to person bit's people
      const hasPerson = personBit.people.some(existPerson => existPerson.id === person.id)
      if (!hasPerson) {
        personBit.people.push(person)
      }

      if (dbPersonBit) {
        updatedPersonBits.push(personBit)
      } else {
        insertedPersonBits.push(personBit)
      }
    }

    for (let person of removedPeople) {
      const dbPersonBit = dbPersonBits.find(personBit => {
        return personBit.email === person.email
      })
      if (dbPersonBit) {
        const personInDbPersonBit = dbPersonBit.people.find(person => {
          return person.email === dbPersonBit.email
        })
        if (personInDbPersonBit) {
          dbPersonBit.people.splice(dbPersonBit.people.indexOf(personInDbPersonBit), 1)
        }
      }
    }
    const removedPersonBits = dbPersonBits.filter(personBit => personBit.people.length === 0)

    // todo: update person bit's "hasGmail", "hasSlack", etc. flags too.

    this.log.timer(`calculating person bits change set`, {
      insertedPersonBits,
      updatedPersonBits,
      removedPersonBits,
    })

    // perform database operations on synced bits
    if (!insertedPeople.length &&
        !updatedPeople.length &&
        !removedPeople.length &&
        !insertedPersonBits.length &&
        !updatedPersonBits.length &&
        !removedPersonBits.length) {
      this.log.info(`no changes were detected, people and person bits were not synced`)
      return
    }

    // there is one problematic use case - if user removes integration during synchronization
    // we should not sync anything (shouldn't write any new person or bit into the database)
    // that's why we check if we have job for this particular setting registered
    // and we do it twice - before saving anything to prevent further operations
    // and after saving everything to make sure setting wasn't removed or requested for removal
    // while we were inserting new bits
    if (await this.syncerRepository.isSettingRemoved()) {
      this.log.warning(`found a setting in a process of removal, skip syncing`)
      return
    }

    this.log.timer(`save people and person bits in the database`)
    try {
      await getManager().transaction(async manager => {
        await manager.save(PersonEntity, insertedPeople, { chunk: 100 })
        await manager.save(PersonEntity, updatedPeople, { chunk: 100 })
        await manager.remove(PersonEntity, removedPeople, { chunk: 100 })
        await manager.save(PersonBitEntity, insertedPersonBits, { chunk: 100 })
        await manager.save(PersonBitEntity, updatedPersonBits, { chunk: 100 })
        await manager.remove(PersonBitEntity, removedPersonBits, { chunk: 100 })

        // before committing transaction we make sure nobody removed setting during period of save
        // we use non-transactional manager inside this method intentionally
        if (await this.syncerRepository.isSettingRemoved())
          throw 'setting removed'
      })

    } catch (error) {
      if (error === 'setting removed') {
        this.log.warning(`found a setting in a process of removal, skip syncing`)
        return
      }
      throw error
    }
    this.log.timer(`save people and person bits in the database`)
  }

}
