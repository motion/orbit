import { Logger } from '@mcro/logger'
import { uniqBy } from 'lodash'
import { getManager } from 'typeorm'
import { Bit, BitEntity } from '@mcro/models'

/**
 * Syncs bits with person type.
 */
export class PersonSyncer {
  private log: Logger

  constructor(log: Logger) {
    this.log = log
  }

  /**
   * Syncs given people in the database.
   * Returns saved (inserted and updated) people.
   */
  async sync(apiPeople: Bit[], dbPeople: Bit[]): Promise<Bit[]> {
    this.log.info('syncing people and person bits', { apiPeople, dbPeople })

    // filter out duplicate people, left only unique people
    apiPeople = uniqBy(apiPeople, person => person.id)
    dbPeople = uniqBy(dbPeople, person => person.id)

    // calculate people that we need to update in the database
    this.log.timer('calculating people change set')
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
    this.log.timer('calculating people change set', {
      insertedPeople,
      updatedPeople,
      removedPeople,
    })

    // perform database operations on synced bits
    if (
      !insertedPeople.length &&
      !updatedPeople.length &&
      !removedPeople.length
    ) {
      this.log.info('no changes were detected, people and person bits were not synced')
      return
    }

    // there is one problematic use case - if user removes Source during synchronization
    // we should not sync anything (shouldn't write any new person or bit into the database)
    // that's why we check if we have job for this particular setting registered
    // and we do it twice - before saving anything to prevent further operations
    // and after saving everything to make sure setting wasn't removed or requested for removal
    // while we were inserting new bits
    // if (await this.syncerRepository.isSettingRemoved()) {
    //   this.log.warning(`found a setting in a process of removal, skip syncing`)
    //   return
    // }

    this.log.timer('save people and person bits in the database')
    await getManager().transaction(async manager => {
      await manager.save(BitEntity, insertedPeople, { chunk: 100 })
      await manager.save(BitEntity, updatedPeople, { chunk: 100 })
      await manager.remove(BitEntity, removedPeople, { chunk: 100 })
    })
    this.log.timer('save people and person bits in the database')
  }
}
