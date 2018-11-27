import { resolveCommand, resolveMany } from '@mcro/mediator'
import { CosalTopWordsCommand, CosalTopicsModel } from '@mcro/models'
import { Cosal } from '@mcro/cosal'

export const getCosalResolvers = (cosal: Cosal) => {
  const cosalTopWords = resolveCommand(CosalTopWordsCommand, async ({ text, max }) => {
    return await cosal.getTopWords(text, { max })
  })

  const cosalTopics = resolveMany(CosalTopicsModel, async ({ query, count }) => {
    const result = (await cosal.topics(query, { max: count })).map(x => `${x.topic}`)
    return result
  })

  return [cosalTopWords, cosalTopics]
}
