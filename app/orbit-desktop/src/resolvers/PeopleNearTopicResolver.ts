import { resolveMany } from '@mcro/mediator'
import { BitEntity, PeopleNearTopicModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { Logger } from '@mcro/logger'
import { getRepository, In } from 'typeorm'

const log = new Logger('BitNearTopicResolver')

export const getPeopleNearTopicsResolver = (cosal: Cosal) => {
  return resolveMany(PeopleNearTopicModel, async ({ topic, count }) => {
    const ids = await cosal.search(topic, count)
    const results = await getRepository(BitEntity).find({
      type: 'person',
      id: In(ids)
    })
    log.info(`Sending ${results.length} topics back`)
    return results
  })
}
