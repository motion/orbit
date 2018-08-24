import { PersonBitEntity } from './entities/PersonBitEntity'
import { PersonEntity } from './entities/PersonEntity'

export async function createOrUpdatePersonBits(
  person: PersonEntity,
): Promise<PersonBitEntity>
export async function createOrUpdatePersonBits(
  person: PersonEntity[],
): Promise<PersonBitEntity[]>
export async function createOrUpdatePersonBits(
  person: PersonEntity | PersonEntity[],
): Promise<PersonBitEntity | PersonBitEntity[]> {

  if (person instanceof Array) {
    return Promise.all(person.map(person => createOrUpdatePersonBits(person)))
  }

  // find a person, if not found create a new one
  let personBit = await PersonBitEntity.findOne(person.email, {
    relations: ['people'],
  })
  if (!personBit) {
    personBit = new PersonBitEntity()
    personBit.email = person.email
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

  const hasPerson = personBit.people.some(existPerson => {
    return existPerson.id === person.id
  })
  if (!hasPerson) {
    personBit.people.push(person)
  }

  await personBit.save()
  return personBit
}
