import { resolveMany } from '@o/mediator'
import { BitEntity, SearchPinnedResultModel } from '@o/models'
import fuzzySort from 'fuzzysort'
import { flatten, uniqBy, zip } from 'lodash'
import { getRepository } from 'typeorm'

const max = 15

const fuzzy = <T extends any[]>(query, results: T): T => {
  const fuzzed: any = fuzzySort.go(query, results, {
    keys: ['title', 'name', 'email'],
    limit: max,
    allowTypo: true,
  })
  return fuzzed.map(x => x['obj'])
}

const sortByQuery = <T extends any[]>(query, results: T): T => {
  if (!query) {
    return results
  }
  // first do with full query
  return fuzzy(query, results)
}

const sortByQuerySubSets = <T extends any[]>(query, results: T): T => {
  const resultSets: T[] = []
  // then do with each result
  for (const split of query.split(' ')) {
    resultSets.push(fuzzy(split, results))
  }
  return flatten(flatten(zip(resultSets))) as T
}

const searchPeople = async query => {
  console.time(`searchPeople ${query}`)
  const words = query.split(' ')
  const res = await getRepository(BitEntity).find({
    take: 12,
    where: [
      {
        type: 'person',
        ...words.map(word => ({
          name: {
            $like: `%${word}%`,
          },
        })),
      },
      {
        type: 'person',
        ...words.map(word => ({
          email: {
            $like: `%${word}%`,
          },
        })),
      },
    ],
  })
  console.timeEnd(`searchPeople ${query}`)
  return res
}

const searchBits = async query => {
  console.time(`searchBits ${query}`)
  const res = await getRepository(BitEntity).find({
    take: 12,
    where: query.split(' ').map(part => ({
      // for recent stuff
      // bitCreatedAt: { $moreThan:  },
      title: {
        $like: `%${part}%`,
      },
    })),
  })
  console.timeEnd(`searchBits ${query}`)
  return res
}

export const SearchPinnedResolver = resolveMany(SearchPinnedResultModel, async ({ query }) => {
  if (!query) {
    return []
  }
  const [people, bits] = await Promise.all([searchPeople(query), searchBits(query)])
  const sortedPeople = sortByQuery(query, people)
  const lessSortedPeople = sortByQuerySubSets(query, people)
  const sortedBits = sortByQuery(query, bits)
  const lessSortedBits = sortByQuerySubSets(query, bits)
  return uniqBy(
    [...sortedPeople, ...lessSortedPeople, ...sortedBits, ...lessSortedBits],
    x => x.id || x['email'],
  )
})
