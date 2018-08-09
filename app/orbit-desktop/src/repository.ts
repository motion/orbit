import { IntegrationType } from '../../models/src'
import { BitEntity } from './entities/BitEntity'
import { PersonBitEntity } from './entities/PersonBitEntity'
import { PersonEntity } from './entities/PersonEntity'

export async function createOrUpdatePersonBit({
  email,
  name,
  photo,
  integration,
  person,
  bit,
}: {
  email: string
  name: string
  photo?: string
  integration: IntegrationType,
  person: PersonEntity,
  bit?: BitEntity,
}): Promise<PersonBitEntity> {

  // find a person, if not found create a new one
  let personBit = await PersonBitEntity.findOne(email, {
    relations: ['people', 'bits'],
  })
  if (!personBit) {
    personBit = new PersonBitEntity()
    personBit.email = email
  }

  // set unfilled properties
  if (!personBit.name) personBit.name = name
  if (!personBit.photo) personBit.photo = photo
  if (!personBit.allNames) personBit.allNames = []
  if (!personBit.allPhotos) personBit.allPhotos = []
  if (!personBit.people) personBit.people = []
  if (!personBit.bits) personBit.bits = []

  // add new properties
  if (name && personBit.allNames.indexOf(name) === -1)
    personBit.allNames.push(name)
  if (photo && personBit.allPhotos.indexOf(photo) === -1)
    personBit.allPhotos.push(photo)

  switch (integration) {
    case 'gmail':
      personBit.hasGmail = true
      break;
    case 'confluence':
      personBit.hasConfluence = true
      break;
    case 'github':
      personBit.hasGithub = true
      break;
    case 'gdrive':
      personBit.hasGdrive = true
      break;
    case 'slack':
      personBit.hasSlack = true
      break;
    case 'jira':
      personBit.hasJira = true
      break;
  }

  const hasPerson = personBit.people.some(existPerson => {
    return existPerson.id === person.id
  })
  if (!hasPerson) {
    personBit.people.push(person)
  }

  if (bit) {
    const hasBit = personBit.bits.some(existBit => {
      return existBit.id === bit.id
    })
    if (!hasBit) {
      personBit.bits.push(bit)
    }
  }

  await personBit.save()
  return personBit
}
