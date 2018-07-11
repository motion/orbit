import { react, store } from '@mcro/black'
import { Bit, Person } from '@mcro/models'

@store
export class PeekRelatedStore {
  relatedPeople = react(
    async () => {
      const people = await Person.find({ take: 3, skip: 7 })
      const bits = await Bit.find({ take: 3, skip: 2, relations: ['people'] })
      return [...people, ...bits]
    },
    { defaultValue: [], delay: 40 },
  )

  relatedConversations = react(
    async () =>
      await Bit.find({
        relations: ['people'],
        where: { integration: 'slack', type: 'conversation' },
        take: 3,
        skip: 2,
      }),
    { defaultValue: [], delay: 40 },
  )
}
