import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import { resolveMany } from '@o/mediator'
import { BitEntity, BitsNearTopicModel } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('BitNearTopicResolver')

export const getBitNearTopicsResolver = (cosal: Cosal) => {
  return resolveMany(BitsNearTopicModel, async ({ topic, count }) => {
    const ids = (await cosal.search(topic, count)).map(x => x.id)
    const results = await getRepository(BitEntity).findByIds(ids)
    log.info(
      `(topic ${topic} count ${count}) => ${ids.length} cosal results, ${
        results.length
      } bit results`,
    )
    return results
  })
}
