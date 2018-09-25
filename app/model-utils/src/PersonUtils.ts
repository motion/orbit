import { Person } from '@mcro/models'
import { hash } from '@mcro/utils'

/**
 * Common Person utility functions.
 */
export class PersonUtils {

  /**
   * Creates a new bit and sets given properties to it.
   */
  static create(properties: Partial<Person>) {
    const person = Object.assign({} as Person, properties)
    person.contentHash = this.contentHash(person)
    return person
  }

  /**
   * Creates a content hash for a given person.
   */
  static contentHash(person: Person): number {
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
