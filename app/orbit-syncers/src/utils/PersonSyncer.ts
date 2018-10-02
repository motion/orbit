import { PersonBitEntity, PersonEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { PersonBitUtils } from '@mcro/model-utils'
import { Person, PersonBit, Setting } from '@mcro/models'
import { uniqBy } from 'lodash'
import { getManager } from 'typeorm'
import { SyncerQueries } from './SyncerQueries'

/**
 * Sync Person options.
 */
export interface PersonSyncerOptions {
  setting: Setting
  log: Logger
  apiPeople: Person[]
  dbPeople: Person[]
  dbPersonBits: PersonBit[]
  skipRemove?: boolean
}

/**
 * Syncs Person.
 */
export class PersonSyncer {

  constructor(private options: PersonSyncerOptions) {
  }

  /**
   * Syncs given people in the database.
   * Returns saved (inserted and updated) people.
   */
  async sync(): Promise<Person[]> {
    let { log, apiPeople, dbPeople, dbPersonBits, skipRemove } = this.options
    log.info(`syncing people and person bits`, this.options)

    // filter out people, left only unique people
    apiPeople = uniqBy(apiPeople, person => person.id)
    dbPeople = uniqBy(dbPeople, person => person.id)

    // for people without emails we create "virtual" email
    for (let person of apiPeople) {
      if (!person.email) {
        person.email = person.name + " from " + person.integration
      }
    }

    // calculate people that we need to update in the database
    log.timer(`calculating people change set`)
    const insertedPeople = apiPeople.filter(apiPerson => {
      return !dbPeople.some(dbPerson => dbPerson.id === apiPerson.id)
    })
    const updatedPeople = apiPeople.filter(apiPerson => {
      const dbPerson = dbPeople.find(dbPerson => dbPerson.id === apiPerson.id)
      return dbPerson && dbPerson.contentHash !== apiPerson.contentHash
    })
    const removedPeople = skipRemove ? [] : dbPeople.filter(dbPerson => {
      return !apiPeople.some(apiPerson => apiPerson.id === dbPerson.id)
    })
    const savedPeople = [...updatedPeople, ...insertedPeople]
    log.timer(`calculating people change set`, { insertedPeople, updatedPeople, removedPeople })

    // calculate people bits that we need to update in the database
    log.timer(`calculating people bits change set`)
    const insertedPersonBits = [], updatedPersonBits = []
    for (let person of savedPeople) {

      // create a person bit from synced person, load database person bit and merge them
      const dbPersonBit = dbPersonBits.find(personBit => personBit.email === person.email)
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

    log.timer(`calculating people bits change set`, {
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
      log.info(`no changes were detected, people and person bits were not synced`)
      return
    }

    // there is one problematic use case - if user removes integration during synchronization
    // we should not sync anything (shouldn't write any new person or bit into the database)
    // that's why we check if we have job for this particular setting registered
    // and we do it twice - before saving anything to prevent further operations
    // and after saving everything to make sure setting wasn't removed or requested for removal
    // while we were inserting new bits
    if (await SyncerQueries.isSettingRemoved(this.options.setting.id)) {
      log.warning(`found a setting in a process of removal, skip syncing`)
      return
    }

    log.timer(`save people and person bits in the database`)
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
        if (await SyncerQueries.isSettingRemoved(this.options.setting.id))
          throw "setting removed"
      })

    } catch (error) {
      if (error === "setting removed") {
        log.warning(`found a setting in a process of removal, skip syncing`)
        return
      }
      throw error
    }
    log.timer(`save people and person bits in the database`)
  }

}
