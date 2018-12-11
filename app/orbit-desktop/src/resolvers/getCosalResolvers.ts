import { resolveCommand, resolveMany } from '@mcro/mediator'
import {
  CosalTopWordsCommand,
  CosalTopicsModel,
  CosalSaliencyModel,
  SalientWord,
} from '@mcro/models'
import { Cosal } from '@mcro/cosal'

export const getCosalResolvers = (cosal: Cosal) => {
  const cosalSaliency = resolveMany(CosalSaliencyModel, async ({ words }) => {
    const cosalRes = await cosal.getWordWeights(words)
    const results: SalientWord[] = cosalRes.map(res => ({ word: res.string, distance: res.weight }))
    return results
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
