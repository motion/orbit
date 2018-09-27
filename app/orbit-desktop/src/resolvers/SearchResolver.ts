import { resolveCommand } from '@mcro/mediator'
import { CosalTopWordsCommand } from '@mcro/models'
import { Cosal } from '@mcro/cosal'

export const getSearchResolver = (cosal: Cosal) => {
  return resolveCommand(CosalTopWordsCommand, async ({ text, max }) => {
    return cosal.getTopWords(text, max)
  })
}
