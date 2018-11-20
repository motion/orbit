import { getIncrementalCovariance, Covariance } from './getIncrementalCovariance'
import { toCosal, Pair } from './toCosal'
import { cosineDistance } from './cosineDistance'
import { pathExists, readJSON, writeJSON, remove } from 'fs-extra'
import { Matrix } from '@mcro/vectorious'
import { join } from 'path'
import { getDefaultVectors } from './getDefaultVectors'
import { defaultSlang } from './helpers'
import { getCovariance } from './getCovariance'

// exports
export { getIncrementalCovariance } from './getIncrementalCovariance'
export { toCosal } from './toCosal'

type Record = {
  id: number
  text: string
}

export type VectorDB = {
  [key: string]: number[]
}

type Result = {
  id: number
  distance: number
}

type CosalWordOpts = {
  max?: number
  sortByWeight?: boolean
  uniqueWords?: boolean
}

type CosalOptions = {
  database?: string
  vectors?: VectorDB
  slang?: { [key: string]: string }
  fallbackVector?: string
}

export class Cosal {
  initialVectors: VectorDB = null
  scannedVectors: VectorDB = {}
  covariance: Covariance = null
  database: string
  started = false
  fallbackVector = null

  constructor({ database, vectors, fallbackVector, slang = defaultSlang }: CosalOptions = {}) {
    this.database = database

    this.initialVectors = vectors || getDefaultVectors()
    this.fallbackVector = fallbackVector || this.initialVectors.hello

    if (!this.fallbackVector) {
      throw new Error(
        'Need to set fallbackVector for custom set, consider something common like "hello"',
      )
    }

    this.covariance = {
      matrix: new Matrix(getCovariance(this.initialVectors)).inverse().toArray(), //getCovariance(this.initialVectors),
      hash: '0',
    }

    // map words to existing vectors, "don't => dont"
    if (slang) {
      for (const original in slang) {
        if (this.initialVectors[original]) {
          this.initialVectors[slang[original]] = this.initialVectors[original]
        }
      }
    }
  }

  async start() {
    if (this.database) {
      await this.setDatabase(this.database)
    }
    this.started = true
  }

  async setDatabase(database: string) {
    this.database = database
    if (!(await pathExists(database))) {
      await this.persist()
    } else {
      try {
        this.readDatabase()
      } catch (err) {
        console.log('Error reading database, removing and resetting...')
        await remove(this.database)
        await this.persist()
        console.error(err)
      }
    }
  }

  private async readDatabase() {
    if (this.database) {
      const { records, covariance } = await readJSON(this.database)
      if (covariance.hash && covariance.matrix) {
        this.scannedVectors = records
        this.covariance = {
          hash: '0',
          matrix: new Matrix(covariance.matrix).inverse().toArray(),
        }
      } else {
        throw new Error('Invalid database')
      }
    }
  }

  private ensureStarted() {
    if (!this.started) {
      throw new Error('You didnt start cosal: await cosal.start()')
    }
  }

  // incremental scan can add more documents
  scan = async (newRecords: Record[]) => {
    this.ensureStarted()

    // this is incremental, passing in previous matrix
    this.covariance = getIncrementalCovariance(
      this.covariance.matrix,
      newRecords.map(record => ({ doc: record.text, weight: 1 })),
      1,
      this.initialVectors,
      this.fallbackVector,
    )

    // update vectors
    const cosals = await Promise.all(
      newRecords.map(record =>
        toCosal(record.text, this.covariance, this.initialVectors, this.fallbackVector),
      ),
    )

    for (const [index, record] of newRecords.entries()) {
      if (this.scannedVectors[record.id]) {
        throw new Error(`Already have a record id ${record.id}`)
      }
      if (!cosals[index]) {
        console.debug('no cosal found for index', index)
        continue
      }
      this.scannedVectors[record.id] = cosals[index].vector
    }

    // persist after scan
    await this.persist()
  }

  // goes through all vectors and sorts by smallest distance up to max
  // TODO better data structure?
  search = async (query: string, max = 10): Promise<Result[]> => {
    this.ensureStarted()
    return this.searchWithCovariance(query, this.covariance, this.scannedVectors, { max })
  }

  private async searchWithCovariance(
    query: string,
    covariance: Covariance,
    vectors: VectorDB,
    { max = 10 },
  ) {
    const cosal = await toCosal(query, covariance, this.initialVectors, this.fallbackVector)
    if (!cosal) {
      console.log('no cosal?', query)
      return []
    }
    let results: Result[] = []
    for (const id in vectors) {
      const vector = vectors[id]
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
      await writeJSON(this.database, { covariance: this.covariance, records: this.scannedVectors })
    }
  }

  topicsList: string[] = null
  topicCovariance: Covariance = null
  topicVectors: VectorDB = {}

  topics = async (query: string, { max = 10 } = {}) => {
    if (!this.topicsList) {
      const path = join(__dirname, '../topics.json')
      this.topicsList = await readJSON(path)
      this.topicCovariance = getIncrementalCovariance(
        this.covariance.matrix,
        this.topicsList.map(doc => ({ doc, weight: 1 })),
        1,
        this.initialVectors,
        this.fallbackVector,
      )
      const cosals = await Promise.all(
        this.topicsList.map(text =>
          toCosal(text, this.topicCovariance, this.initialVectors, this.fallbackVector),
        ),
      )
      for (const [index, record] of cosals.entries()) {
        if (!record) {
          console.log('no record', this.topicsList[index])
          continue
        }
        this.topicVectors[index] = record.vector
      }
    }
    const results = await this.searchWithCovariance(
      query,
      this.topicCovariance,
      this.topicVectors,
      { max },
    )
    return results.map(res => ({ ...res, topic: this.topicsList[res.id] }))
  }

  getWordWeights = async (
    text: string,
    { max = Infinity, sortByWeight, uniqueWords }: CosalWordOpts = {},
  ): Promise<Pair[] | null> => {
    this.ensureStarted()

    const cosal = await toCosal(text, this.covariance, this.initialVectors, this.fallbackVector, {
      uniqueWords,
    })

    if (!cosal) {
      return null
    }

    let pairs = cosal.pairs
    let fmax = max

    if (max !== Infinity) {
      if (pairs.length > max) {
        let res = pairs

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

  getTopWords = async (text: string, { max = 10, sortByWeight = true }: CosalWordOpts = {}) => {
    this.ensureStarted()

    const words = await this.getWordWeights(text, { max, sortByWeight, uniqueWords: true })
    if (!words) {
      return []
    }
    return words.map(x => x.string.replace(/\s\s*/g, ' ').trim())
  }
}
