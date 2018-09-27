import corpusCovarPrecomputed from './corpusCovar'
import { getCovariance, Covariance } from './getCovariance'
import { toCosal, Pair } from './toCosal'
import { uniqBy } from 'lodash'
import { commonWords } from './commonWords'
import { cosineDistance } from './cosineDistance'
// import { Matrix } from '@mcro/vectorious'

export { getCovariance } from './getCovariance'
export { toCosal } from './toCosal'

type Record = {
  id: number
  text: string
}

type VectorDB = {
  [key: string]: number[]
}

type Result = {
  id: string
  distance: number
}

export class Cosal {
  vectors: VectorDB = {}
  covariance: Covariance = null

  // incremental scan can add more and more documents
  async scan(newRecords: Record[]) {
    // this is incremental, passing in previous matrix
    this.covariance = getCovariance(
      this.covariance ? this.covariance.matrix : corpusCovarPrecomputed,
      newRecords.map(record => ({ doc: record.text, weight: 1 })),
    )

    // update vectors
    const cosals = await Promise.all(
      newRecords.map(record => toCosal(record.text, this.covariance)),
    )
    for (const [index, record] of newRecords.entries()) {
      if (this.vectors[record.id]) {
        throw new Error(`Already have a record id ${record.id}`)
      }
      this.vectors[record.id] = cosals[index].vector
    }
  }

  // goes through all vectors and sorts by smallest distance up to max
  // TODO better data structure?
  async search(query: string, max = 10): Promise<Result[]> {
    const cosal = await toCosal(query, this.covariance)
    let results: Result[] = []

    for (const id in this.vectors) {
      const vector = this.vectors[id]
      const distance = cosineDistance(cosal.vector, vector)
      if (!results.length) {
        results.push({ id, distance })
        continue
      }
      const len = results.length
      if (distance < results[len - 1].distance) {
        const insertIndex = results.findIndex(x => distance < x.distance)
        results.splice(insertIndex, len > max ? 1 : 0, { id, distance })
      }
    }

    return results
  }

  async persist(file: string) {
    console.log('write to file', file)
  }

  async getWordWeights(text: string, max?: number): Promise<Pair[] | null> {
    const cosal = await toCosal(text, this.covariance)
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
        return pairs.slice(0, fmax)
      }
    }
    return pairs
  }

  async getTopWords(text: string, max?: number) {
    const words = await this.getWordWeights(text, max)
    if (!words) {
      return []
    }
    return words.map(x => x.string.replace(/\s\s*/g, ' ').trim())
  }
}
