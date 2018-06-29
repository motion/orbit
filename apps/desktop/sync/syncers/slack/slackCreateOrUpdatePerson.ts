import { Person, createOrUpdate } from '@mcro/models'
import { SlackPerson } from './types'

export default async (person: SlackPerson, returnIfUnchanged = false) => {
  return await createOrUpdate(
    Person,
    {
      identifier: `slack-person.id`,
      integrationId: person.id,
      integration: 'slack',
      name: person.name,
      data: {
        ...person,
      },
    },
    { matching: Person.identifyingKeys, returnIfUnchanged },
  )
}
