import { Person, PersonBit } from '@mcro/models'

export async function createOrUpdatePersonBit({ email, name, photo, integration, identifier, person }: { email: string, name: string, photo?: string, integration: string, identifier: string, person: Person }): Promise<PersonBit> {

  // find a person, if not found create a new one
  let personBit = await PersonBit.findOne(email, { relations: ["people"] })
  if (!personBit) {
    personBit = new PersonBit()
    personBit.email = email
  }

  // set unfilled properties
  if (!personBit.name)
    personBit.name = name
  if (!personBit.photo)
    personBit.photo = photo
  if (!personBit.allNames)
    personBit.allNames = []
  if (!personBit.allPhotos)
    personBit.allPhotos = []
  if (!personBit.people)
    personBit.people = []

  // add new properties
  if (name && personBit.allNames.indexOf(name) === -1)
    personBit.allNames.push(name)
  if (photo && personBit.allPhotos.indexOf(photo) === -1)
    personBit.allPhotos.push(photo)

  const hasPerson = personBit.people.some(person => {
    return person.integration === integration && person.identifier === identifier
  })
  if (!hasPerson)
    personBit.people.push(person)

  await personBit.save()
  return personBit
}