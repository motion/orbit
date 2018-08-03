import { react } from '@mcro/black'
import { Bit } from '@mcro/models'

export class PeekRelatedStore {
  relatedBits = react(
    () => BitRepository.find({ take: 6, skip: 2, relations: ['people'] }),
    { defaultValue: [], delay: 250 },
  )
}
