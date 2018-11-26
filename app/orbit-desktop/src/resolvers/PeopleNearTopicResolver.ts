import { resolveMany } from '@mcro/mediator'
import { PeopleNearTopicModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { Logger } from '@mcro/logger'
import { PersonBitEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'

const log = new Logger('BitNearTopicResolver')

export const getBitNearTopicsResolver = (cosal: Cosal) => {
  return resolveMany(PeopleNearTopicModel, async ({ topic, count }) => {
    const ids = await cosal.search(topic, count)
    const results = await getRepository(PersonBitEntity).findByIds(ids)
    log.info(`Sending ${results.length} topics back`)
    return results
  })
}
