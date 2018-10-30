import { resolveMany } from '@mcro/mediator'
import { SearchByTopicModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { getRepository } from 'typeorm'
import { BitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'

const log = new Logger('SalientWordsResolver')

export const getSearchByTopicResolver = (cosal: Cosal) => {
  return resolveMany(SearchByTopicModel, async ({ query, count }) => {
    console.time('cosal')
    const ids = await cosal.search(query, count)
    console.timeEnd('cosal')
    const bits = await getRepository(BitEntity).findByIds(ids.map(x => x.id))
    log.info(`got ${bits.length} topic search results`)
    return bits
  })
}
