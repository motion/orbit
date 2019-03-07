import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import { resolveMany } from '@o/mediator'
import { BitEntity, PeopleNearTopicModel } from '@o/models'
import { getRepository, In } from 'typeorm'

const log = new Logger('BitNearTopicResolver')

export const getPeopleNearTopicsResolver = (cosal: Cosal) => {
  return resolveMany(PeopleNearTopicModel, async ({ topic, count }) => {
    const ids = await cosal.search(topic, count)
    const results = await getRepository(BitEntity).find({
      type: 'person',
      id: In(ids),
    })
    log.info(`Sending ${results.length} topics back`)
    return results
  })
}
