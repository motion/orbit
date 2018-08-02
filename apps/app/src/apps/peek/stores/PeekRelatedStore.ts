import { react, store } from '@mcro/black'
import { BitRepository, PersonRepository } from '../../../repositories'

@store
export class PeekRelatedStore {
  relatedPeople = react(() => PersonRepository.find({ take: 3, skip: 7 }), {
    defaultValue: [],
    delay: 250,
  })

  relatedBits = react(
    () => BitRepository.find({ take: 3, skip: 2, relations: ['people'] }),
    { defaultValue: [], delay: 250 },
  )

  relatedConversations = react(
    async () =>
      await BitRepository.find({
        relations: ['people'],
        where: { integration: 'slack', type: 'conversation' },
        take: 3,
        skip: 2,
      }),
    { defaultValue: [], delay: 250 },
  )
}
