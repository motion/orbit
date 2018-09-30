import { resolveCommand } from '@mcro/mediator'
import { CosalTopWordsCommand } from '@mcro/models'
import { Cosal } from '@mcro/cosal'

export const getCosalResolvers = (cosal: Cosal) => {
  const cosalTopWords = resolveCommand(CosalTopWordsCommand, async ({ text, max }) => {
    return cosal.getTopWords(text, { max })
  })

  // TODO: add relevancy and wordWeights...

  return [cosalTopWords]
}
