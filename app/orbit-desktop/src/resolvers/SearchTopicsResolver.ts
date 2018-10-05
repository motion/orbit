import { resolveMany } from '@mcro/mediator'
import { SearchTopicsModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { getSearchQuery } from './getSearchQuery'
import { getRepository } from 'typeorm'
import { BitEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'

const log = new Logger('SearchTopicsResolver')

export const getSearchTopicsResolver = (cosal: Cosal) => {
  return resolveMany(SearchTopicsModel, async ({ query, count }) => {
    const searchQuery = getSearchQuery(query)
    log.info('SearchTopics query', searchQuery)
    const results = await getRepository(BitEntity).find(searchQuery)
    const resultBodies = results.map(bit => `${bit.title} ${bit.body}`).join(' ')
    const topics = await cosal.getTopWords(resultBodies, { max: count, sortByWeight: true })
    log.info(`Sending ${topics.length} topics back from ${results.length} bits`)
    return topics
  })
}
