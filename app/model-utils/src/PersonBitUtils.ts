import { Person } from '@mcro/models'
import { PersonBit } from '@mcro/models'
import { hash } from '@mcro/utils'

/**
 * Common PersonBit utility functions.
 */
export class PersonBitUtils {

  /**
   * Creates a new person bit from a given person.
   */
  static createFromPerson(person: Person): PersonBit {

    const personBit: PersonBit = {
      target: 'person-bit',
      id: hash(person.email),
      email: person.email,
    }

    // set unfilled properties
    if (!personBit.name) personBit.name = person.name
    if (!personBit.photo) personBit.photo = person.photo
    if (!personBit.allNames) personBit.allNames = {}
    if (!personBit.allPhotos) personBit.allPhotos = {}
    if (!personBit.people) personBit.people = []

    // add new properties
    if (person.name)
      personBit.allNames[person.integration] = person.name
    if (person.photo)
      personBit.allPhotos[person.integration] = person.photo

    // if we have default photo and name value
    // that is not defined in all names and all photos
    // it means this default photo/name value is obsolete
    // and we need to update it
    const isNameValid = Object.keys(personBit.allNames)
      .map(key => personBit.allNames[key])
      .indexOf(person.name) !== -1
    const isPhotoValid = Object.keys(personBit.allPhotos)
      .map(key => personBit.allPhotos[key])
      .indexOf(person.photo) !== -1

    if (!isNameValid && personBit.allNames[person.integration])
      person.name = personBit.allNames[person.integration]
    if (!isPhotoValid && personBit.allPhotos[person.integration])
      person.photo = personBit.allPhotos[person.integration]

    switch (person.integration) {
      case 'gmail':
        personBit.hasGmail = true
        break
      case 'confluence':
        personBit.hasConfluence = true
        break
      case 'github':
        personBit.hasGithub = true
        break
      case 'gdrive':
        personBit.hasGdrive = true
        break
      case 'slack':
        personBit.hasSlack = true
        break
      case 'jira':
        personBit.hasJira = true
        break
    }

    return personBit
  }

  /**
   * Merges given person bits.
   */
  static merge(personBit1: Partial<PersonBit>, personBit2: Partial<PersonBit>): PersonBit {

    const personBit: PersonBit = {
      target: 'person-bit',
      ...personBit1,
      ...personBit2,
    }

    if (!personBit.allNames) {
      personBit.allNames = {
        ...(personBit1.allNames || {}),
        ...(personBit2.allNames || {}),
      }
    }
    if (!personBit.allPhotos) {
      personBit.allPhotos = {
        ...(personBit1.allPhotos || {}),
        ...(personBit2.allPhotos || {}),
      }
    }
    if (!personBit.people) {
      personBit.people = [
        ...(personBit1.people || []),
        ...(personBit2.people || []),
      ]
    }
    return personBit
  }

}
