import { hash } from '@mcro/utils'
import { Person } from '../interfaces/Person'

/**
 * Common Person utility functions.
 */
export class PersonUtils {
  /**
   * Creates a new bit and sets given properties to it.
   */
  static create(properties: Partial<Person>) {
    const person: Person = { target: 'person', ...properties }
    person.contentHash = this.contentHash(person)
    if (!person.sourceId && person.source) person.sourceId = person.source.id
    if (person.integration && person.sourceId && person.email)
      person.id = hash(`${person.integration}-${person.sourceId}-${person.email}`)
    return person
  }

  /**
   * Creates a content hash for a given person.
   */
  static contentHash(person: Person): number {
    return hash(
      [
        person.id,
        person.integration,
        person.integrationId,
        person.source ? person.source.id : person.sourceId,
        person.email,
        person.photo,
        person.name,
        person.data,
        person.webLink,
        person.desktopLink,
      ].filter(item => item !== null && item !== undefined),
    )
  }
}
