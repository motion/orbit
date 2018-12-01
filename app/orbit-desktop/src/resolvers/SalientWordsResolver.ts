import { resolveMany } from '@mcro/mediator'
import { SalientWordsModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'
import { Logger } from '@mcro/logger'

const log = new Logger('SalientWordsResolver')

export const getSalientWordsResolver = (cosal: Cosal) => {
  return resolveMany(SalientWordsModel, async ({ /* query,  */ count }) => {
    // const searchQuery = getSearchQuery(query)
    // log.info('SalientWords query', searchQuery)
    const results = [] // await getRepository(BitEntity).find(searchQuery)
    log.info('got results', results)
    const resultBodies = results.map(bit => `${bit.title} ${bit.body}`).join(' ')
    const topics = await cosal.getTopWords(resultBodies, { max: count, sortByWeight: true })
    log.info(`Sending ${topics.length} topics back from ${results.length} bits`)
    return topics
  })
}
