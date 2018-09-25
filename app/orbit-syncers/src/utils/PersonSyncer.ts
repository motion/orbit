import { PersonEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Person } from '@mcro/models'
import { hash } from '@mcro/utils'
import { chunk, uniqBy } from 'lodash'
import { getManager } from 'typeorm'
import { createOrUpdatePersonBits } from './repository'

/**
 * Syncs Person.
 */
export class PersonSyncer {

  /**
   * Syncs given people in the database.
   */
  static async sync(log: Logger, apiPeople: Person[], dbPeople: Person[], options?: { skipRemove?: boolean }) {

    // filter out people, left only unique people
    apiPeople = uniqBy(apiPeople, person => person.id)
    dbPeople = uniqBy(dbPeople, person => person.id)

    // calculate people that we need to update in the database
    log.verbose(`calculating inserted/updated/removed people`, { apiPeople, dbPeople })
    const insertedPersons = apiPeople.filter(apiPerson => {
      return !dbPeople.some(dbPerson => dbPerson.id === apiPerson.id)
    })
    const updatedPersons = apiPeople.filter(apiPerson => {
      const dbPerson = dbPeople.find(dbPerson => dbPerson.id === apiPerson.id)
      return dbPerson && dbPerson.contentHash !== apiPerson.contentHash
    })
    const removedPersons = options && options.skipRemove ? [] : dbPeople.filter(dbPerson => {
      return !apiPeople.some(apiPerson => apiPerson.id === dbPerson.id)
    })

    // perform database operations on synced bits
    if (insertedPersons.length || updatedPersons.length || removedPersons.length) {
      log.timer(`save people in the database`, { insertedPersons, updatedPersons, removedPersons })
      await getManager().transaction(async manager => {
        if (insertedPersons.length > 0) {
          const insertedPersonChunks = chunk(insertedPersons, 50)
          for (let bits of insertedPersonChunks) {
            await manager.insert(PersonEntity, bits)
          }
        }
        for (let bit of updatedPersons) {
          await manager.update(PersonEntity, { id: bit.id }, bit)
        }
        if (removedPersons.length > 0) {
          await manager.delete(PersonEntity, removedPersons)
        }
      })

      // note: some people don't have their email exposed, that's why we need this check
      await Promise.all(
        apiPeople.filter(person => person.email).map(async person => {
          person.personBit = await createOrUpdatePersonBits(person as PersonEntity)
        }),
      )
      log.timer(`save people in the database`)
    } else {
      log.verbose(`no changes were detected, nothing was synced`)
    }
  }

  /**
   * Creates a new bit and sets given properties to it.
   */
  static create(properties: Partial<Person>) { // todo: this can be extracted into @mcro/model-utils
    const bit = Object.assign(new PersonEntity(), properties)
    bit.contentHash = this.contentHash(bit)
    return bit
  }

  /**
   * Creates a content hash for a given person.
   */
  private static contentHash(person: Person): number { // todo: this can be extracted into @mcro/model-utils
    return hash([
      person.id,
      person.integration,
      person.integrationId,
      person.settingId,
      person.email,
      person.photo,
      person.name,
      person.data,
      person.webLink,
      person.desktopLink,
    ].filter(item => item !== null && item !== undefined))
  }

}
