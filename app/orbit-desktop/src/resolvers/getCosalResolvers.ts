import { Cosal } from '@o/cosal'
import { Logger } from '@o/logger'
import { resolveMany } from '@o/mediator'
import { BitEntity, CosalSaliencyModel, CosalTopicsModel, CosalTopWordsModel, SearchByTopicModel } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('CosalResolver')

export const getCosalResolvers = (cosal: Cosal) => {
  const cosalSearch = resolveMany(SearchByTopicModel, async ({ query, count }) => {
    console.time('cosal')
    const ids = await cosal.search(query, { max: count })
    console.timeEnd('cosal')
    const bits = await getRepository(BitEntity).findByIds(ids.map(x => x.id))
    log.info(`got ${bits.length} topic search results`)
    return bits
  })

  const cosalSaliency = resolveMany(CosalSaliencyModel, async ({ words }) => {
    const cosalRes = await cosal.getWordWeights(words)
    return cosalRes.map(res => ({ word: res.string, uniqueness: res.weight }))
  })

  const cosalTopWords = resolveMany(CosalTopWordsModel, async ({ text, max }) => {
    return await cosal.getTopWords(text, { max })
  })

  const cosalTopics = resolveMany(CosalTopicsModel, async ({ query, count }) => {
    const result = (await cosal.topics(query, { max: count })).map(x => `${x.topic}`)
    return result
  })

  return [cosalSearch, cosalSaliency, cosalTopWords, cosalTopics]
}
