import { getCovariance } from './getCovariance'
import { toCosal, Weight } from './toCosal'
import { uniqBy, sortBy } from 'lodash'
import { commonWords } from './commonWords'
import { cosineDistance } from './cosineDistance'

export { getCovariance } from './getCovariance'
export { toCosal } from './toCosal'

const emptyCovar = getCovariance([])

export class Cosal {
  cosals = null
  covariance = null

  async scan(docs: string[]) {
    this.covariance = getCovariance(docs.map(doc => ({ doc, weight: 1 })))
    this.cosals = await Promise.all(docs.map(doc => toCosal(doc, this.covariance)))
  }

  async search(query: string) {
    const cosal = await toCosal(query, this.covariance)
    const distances = this.cosals.map(({ vector }, index) => ({
      index,
      distance: cosineDistance(cosal.vector, vector),
    }))
    return sortBy(distances, 'distance').map(x => this.cosals[x.index])
  }
}

export async function getWordWeights(text: string, max?: number): Promise<Weight[] | null> {
  const cosal = await toCosal(text, emptyCovar)
  if (!cosal) {
    return null
  }
  let pairs = cosal.pairs.filter(x => !commonWords[x.string])
  let fmax = max
  if (max) {
    if (pairs.length > max) {
      // sort by weight
      const uniqSorted = uniqBy(pairs, x => x.string.toLowerCase())
      uniqSorted.sort((a, b) => (a.weight > b.weight ? -1 : 1))
      // make sure we get the new last index, could be shorter
      fmax = Math.min(uniqSorted.length - 1, max)
      // find our topmost weight
      const limitWeight = uniqSorted[fmax].weight
      // now map and filter but keeping original order
      pairs = pairs.filter(x => x.weight >= limitWeight)
    }
  }
  return pairs.slice(0, fmax)
}

export async function getTopWords(text: string, max?: number) {
  const words = await this.getWordWeights(text, max)
  if (!words) {
    return []
  }
  return words.map(x => x.string.replace(/\s\s*/g, ' ').trim())
}
