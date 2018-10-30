import corpusCovarPrecomputed from './corpusCovar'
import { getCovariance, Covariance } from './getCovariance'
import { toCosal, Pair } from './toCosal'
import { uniqBy } from 'lodash'
import { cosineDistance } from './cosineDistance'
import { pathExists, readJSON, writeJSON } from 'fs-extra'
import { vectors } from './helpers'

// exports
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
  id: number
  distance: number
}

type CosalWordOpts = { max?: number; sortByWeight?: boolean; uniqueWords?: boolean }

export class Cosal {
  allVectors = vectors
  vectors: VectorDB = {}
  covariance: Covariance = null
  database: string
  started = false

  constructor({ database }: { database?: string } = {}) {
    this.database = database
  }

  async start() {
    if (this.database) {
      await this.setDatabase(this.database)
    } else {
      this.loadPrecomputedDatabase()
    }
    this.started = true
  }

  async setDatabase(database: string) {
    this.database = database
    this.loadPrecomputedDatabase()
    if (!(await pathExists(database))) {
      await this.persist()
    } else {
      const { records, covariance } = await readJSON(database)
      if (covariance.hash && covariance.matrix) {
        this.vectors = records
        this.covariance = covariance
      } else {
        throw new Error('Invalid database')
      }
    }
  }

  private loadPrecomputedDatabase() {
    this.covariance = {
      matrix: corpusCovarPrecomputed,
      hash: '0',
    }
  }

  private ensureStarted() {
    if (!this.started) {
      throw new Error('You didnt start cosal: await cosal.start()')
    }
  }

  // incremental scan can add more and more documents
  scan = async (newRecords: Record[]) => {
    this.ensureStarted()

    // this is incremental, passing in previous matrix
    this.covariance = getCovariance(
      this.covariance.matrix,
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
      if (!cosals[index]) {
        console.log('no cosal found for index', index)
        continue
      }
      this.vectors[record.id] = cosals[index].vector
    }

    // persist after scan
    await this.persist()
  }

  // goes through all vectors and sorts by smallest distance up to max
  // TODO better data structure?
  search = async (query: string, max = 10): Promise<Result[]> => {
    this.ensureStarted()
    const cosal = await toCosal(query, this.covariance)
    let results: Result[] = []

    for (const id in this.vectors) {
      const vector = this.vectors[id]
      if (!vector) {
        continue
      }
      const distance = cosineDistance(cosal.vector, vector)
      const result = { id: +id, distance }
      if (!results.length) {
        results.push(result)
        continue
      }
      const len = results.length
      if (distance < results[len - 1].distance) {
        const insertIndex = results.findIndex(x => distance < x.distance)
        results.splice(insertIndex, len > max ? 1 : 0, result)
      }
    }

    return results
  }

  async persist() {
    if (this.database) {
      await writeJSON(this.database, { covariance: this.covariance, records: this.vectors })
    }
  }

  getWordWeights = async (
    text: string,
    { max = 10, sortByWeight, uniqueWords }: CosalWordOpts = {},
  ): Promise<Pair[] | null> => {
    const cosal = await toCosal(text, this.covariance)
    if (!cosal) {
      return null
    }
    let pairs = cosal.pairs
    let fmax = max
    if (max) {
      if (pairs.length > max) {
        let res = pairs

        // uniqueWords
        if (uniqueWords) {
          res = uniqBy(pairs, x => x.string.toLowerCase())
        }

        // sortByWeight
        if (sortByWeight) {
          return res.sort((a, b) => b.weight - a.weight).slice(0, max)
        }

        // max, in order they appeared in
        // get new last index (could be shorter)
        fmax = Math.min(res.length - 1, max)
        // find our topmost weight
        const limitWeight = res[fmax].weight
        // now map and filter but keeping original order
        return res.filter(x => x.weight >= limitWeight).slice(0, fmax)
      }
    }
    return pairs
  }

  getTopWords = async (text: string, { max = 10, sortByWeight }: CosalWordOpts = {}) => {
    const words = await this.getWordWeights(text, { max, sortByWeight, uniqueWords: true })
    if (!words) {
      return []
    }
    return (
      words
        // filter numbers
        .filter(word => word.string != `${+word.string}`)
        .map(x => x.string.replace(/\s\s*/g, ' ').trim())
    )
  }
}
