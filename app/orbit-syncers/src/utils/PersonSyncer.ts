import { PersonBitEntity, PersonEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { PersonBitUtils } from '@mcro/model-utils'
import { Person, PersonBit } from '@mcro/models'
import { uniqBy } from 'lodash'
import { getManager } from 'typeorm'

export interface PersonSyncerOptions {
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

  /**
   * Syncs given people in the database.
   */
  static async sync(options: PersonSyncerOptions) {
    let { log, apiPeople, dbPeople, dbPersonBits, skipRemove } = options
    log.info(`syncing people and person bits`, options)

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
    if (insertedPeople.length ||
      updatedPeople.length ||
      removedPeople.length ||
      insertedPersonBits.length ||
      updatedPersonBits.length ||
      removedPersonBits.length) {
      log.timer(`save people and person bits in the database`)
      await getManager().transaction(async manager => {
        await manager.save(PersonEntity, insertedPeople)
        await manager.save(PersonEntity, updatedPeople)
        await manager.remove(PersonEntity, removedPeople)
        await manager.save(PersonBitEntity, insertedPersonBits)
        await manager.save(PersonBitEntity, updatedPersonBits)
        await manager.remove(PersonBitEntity, removedPersonBits)
      })
      log.timer(`save people and person bits in the database`)
    } else {
      log.info(`no changes were detected, people and person bits were not synced`)
    }
  }

}
