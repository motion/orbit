import { getCovariance } from './getCovariance'
import { toCosal, Weight } from './toCosal'
import { uniqBy } from 'lodash'

export { getCovariance } from './getCovariance'
export { toCosal } from './toCosal'

let emptyCovar = getCovariance([])

export async function getWordWeights(text: string, max?: number): Promise<Weight[] | null> {
  emptyCovar = emptyCovar || getCovariance([])
  const cosal = await toCosal(text, emptyCovar)
  if (!cosal) {
    return null
  }
  let pairs = cosal.pairs
  if (max) {
    if (pairs.length > max) {
      const uniqSorted = uniqBy(pairs, x => x.string)
      uniqSorted.sort((a, b) => (a.weight > b.weight ? -1 : 1))
      const limitWeight = uniqSorted[max].weight
      // keep original order of titles
      pairs = pairs.filter(x => x.weight >= limitWeight)
    }
  }
  return pairs.slice(0, max)
}

export async function getTopWords(text: string, max?: number) {
  const words = await getWordWeights(text, max)
  if (!words) {
    return []
  }
  return words.map(x => x.string.replace(/\s\s*/g, ' ').trim())
}
