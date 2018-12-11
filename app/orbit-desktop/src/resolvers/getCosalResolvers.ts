import { resolveCommand, resolveMany } from '@mcro/mediator'
import { CosalTopWordsCommand, CosalTopicsModel, CosalSaliencyModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'

export const getCosalResolvers = (cosal: Cosal) => {
  const cosalSaliency = resolveMany(CosalSaliencyModel, async ({ words }) => {
    const cosalRes = await cosal.getWordWeights(words)
    return cosalRes.map(res => ({ word: res.string, uniqueness: res.weight }))
  })

  const cosalTopWords = resolveCommand(CosalTopWordsCommand, async ({ text, max }) => {
    return await cosal.getTopWords(text, { max })
  })

  const cosalTopics = resolveMany(CosalTopicsModel, async ({ query, count }) => {
    const result = (await cosal.topics(query, { max: count })).map(x => `${x.topic}`)
    return result
  })

  return [cosalSaliency, cosalTopWords, cosalTopics]
}
