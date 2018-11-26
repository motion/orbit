import { resolveMany } from '@mcro/mediator'
import { BitsNearTopicModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { Logger } from '@mcro/logger'
import { BitEntity } from '@mcro/entities'
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
