import { Person, createOrUpdate } from '@mcro/models'
import * as Helpers from '~/helpers'
import { SlackPerson } from './types'

export default async (person: SlackPerson, returnIfUnchanged = false) => {
  return await createOrUpdate(
    Person,
    {
      identifier: `slack-${Helpers.hash(person)}`,
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
