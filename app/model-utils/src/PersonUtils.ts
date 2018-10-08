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
    const person: Person = { target: 'person', ...properties }
    person.contentHash = this.contentHash(person)
    if (!person.settingId && person.setting)
      person.settingId = person.setting.id
    if (person.integration && person.settingId && person.email)
      person.id = hash(`${person.integration}-${person.settingId}-${person.email}`)
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
      person.setting ? person.setting.id : person.settingId,
      person.email,
      person.photo,
      person.name,
      person.data,
      person.webLink,
      person.desktopLink,
    ].filter(item => item !== null && item !== undefined))
  }

}
