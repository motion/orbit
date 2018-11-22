import { getIncrementalCovariance, Covariance } from './getIncrementalCovariance'
import { toCosal, Pair } from './toCosal'
import { pathExists, readJSON, writeJSON, remove } from 'fs-extra'
import { getDefaultVectors } from './getDefaultVectors'
import { defaultSlang } from './helpers'
import { getCovariance } from './getCovariance'
import { annoySearch, annoyScan } from './annoy'
import { join } from 'path'

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

export type Result = {
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

const initialState = {
  records: {
    covariance: null as Covariance,
    indexToId: [],
    indexToVector: [],
  },
  topics: {
    covariance: null as Covariance,
    indexToId: [],
    indexToVector: [],
  },
}

type DBType = keyof typeof initialState

export class Cosal {
  databasePath: string
  started = false
  fallbackVector = null
  seedVectors = {} as VectorDB

  // this is what persists to disk and mutates over time
  state = initialState

  constructor({ database, vectors, fallbackVector, slang = defaultSlang }: CosalOptions = {}) {
    this.databasePath = database
    this.seedVectors = vectors || getDefaultVectors()
    this.fallbackVector = fallbackVector || this.seedVectors.hello

    if (!this.fallbackVector) {
      throw new Error(
        'Need to set fallbackVector for custom set, consider something common like "hello"',
      )
    }

    this.setInitialCovariance({
      matrix: getCovariance(this.seedVectors),
      hash: '0',
    })

    // map words to existing vectors, "don't => dont"
    if (slang) {
      for (const original in slang) {
        if (this.seedVectors[original]) {
          this.seedVectors[slang[original]] = this.seedVectors[original]
        }
      }
    }
  }

  async start() {
    if (this.databasePath) {
      await this.setDatabase(this.databasePath)
    }
    this.started = true
  }

  async setDatabase(database: string) {
    this.databasePath = database

    if (!(await pathExists(database))) {
      await this.persist()
    } else {
      try {
        await this.readDatabase()
      } catch (err) {
        console.log('Error reading database, removing and resetting...')
        await remove(this.databasePath)
        await this.persist()
        console.error(err)
      }
    }
  }

  private setInitialCovariance(covariance: Covariance) {
    for (const db in this.state) {
      this.state[db].covariance = covariance
    }
  }

  private async readDatabase() {
    if (this.databasePath) {
      const state = await readJSON(this.databasePath)
      if (state && state.records && state.records.covariance) {
        this.state = state
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

  private getVectorForId(db: DBType, id: number) {
    const index = this.state[db].indexToId[id]
    return this.state[db].indexToVector[index]
  }

  private addRecord(db: DBType, id: number, vector: number[]) {
    this.state[db].indexToId.push(id)
    this.state[db].indexToVector.push(vector)
  }

  // incremental scan can add more documents
  scan = async (newRecords: Record[], db: DBType = 'records') => {
    this.ensureStarted()

    // this is incremental, passing in previous matrix
    this.state[db].covariance = getIncrementalCovariance(
      this.state[db].covariance.matrix,
      newRecords.map(record => ({ doc: record.text, weight: 1 })),
      1,
      this.seedVectors,
      this.fallbackVector,
    )

    // update vectors
    const cosals = await Promise.all(
      newRecords.map(record =>
        toCosal(record.text, this.state[db].covariance, this.seedVectors, this.fallbackVector),
      ),
    )

    for (const [index, record] of newRecords.entries()) {
      if (this.getVectorForId(db, record.id)) {
        throw new Error(`Already have a record id ${record.id}`)
      }
      if (!cosals[index]) {
        console.debug('no cosal found for index', index)
        continue
      }
      this.addRecord(db, record.id, cosals[index].vector)
    }

    // persist after scan
    await this.persist()
  }

  // takes a vector, returns a list of ids
  searchWithAnnoy = async (db: DBType, vector: number[], { max }) => {
    return await annoySearch({
      path: this.databasePath,
      db,
      vector,
      max,
    })
  }

  // goes through all vectors and sorts by smallest distance up to max
  // TODO better data structure?
  search = async (query: string, max = 10) => {
    this.ensureStarted()
    return await this.searchWithCovariance('records', query, {
      max,
    })
  }

  private async searchWithCovariance(db: DBType, query: string, { max = 10 }) {
    const cosal = await toCosal(
      query,
      this.state[db].covariance,
      this.seedVectors,
      this.fallbackVector,
    )
    if (!cosal) {
      console.log('no vectors for query', query)
      return []
    }
    return await this.searchWithAnnoy(db, cosal.vector, { max })
  }

  async persist() {
    if (this.databasePath) {
      await writeJSON(this.databasePath, this.state)
      await annoyScan({ db: 'records', path: this.databasePath })
    }
  }

  topicsList = null

  topics = async (query: string, { max = 10 } = {}) => {
    if (!this.topicsList) {
      this.topicsList = await readJSON(join(__dirname, '../topics2.json'))
      await this.scan(this.topicsList.slice(0, 100).map((text, id) => ({ text, id })), 'topics')
      await annoyScan({ db: 'topics', path: this.databasePath })
    }
    const res = await this.searchWithCovariance('topics', query, { max })
    return res.map(res => ({ ...res, topic: this.topicsList[res.id] }))
  }

  getWordWeights = async (
    text: string,
    { max = Infinity, sortByWeight, uniqueWords }: CosalWordOpts = {},
  ): Promise<Pair[] | null> => {
    this.ensureStarted()

    const cosal = await toCosal(
      text,
      this.state.records.covariance,
      this.seedVectors,
      this.fallbackVector,
      {
        uniqueWords,
      },
    )

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
