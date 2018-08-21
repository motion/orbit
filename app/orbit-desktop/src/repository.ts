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
  if (!personBit.allNames) personBit.allNames = []
  if (!personBit.allPhotos) personBit.allPhotos = []
  if (!personBit.people) personBit.people = []

  // add new properties
  if (person.name && personBit.allNames.indexOf(person.name) === -1)
    personBit.allNames.push(person.name)
  if (person.photo && personBit.allPhotos.indexOf(person.photo) === -1)
    personBit.allPhotos.push(person.photo)

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
