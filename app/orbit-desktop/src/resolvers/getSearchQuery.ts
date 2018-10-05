import { FindOptions } from 'typeorm'
import { Bit, SearchQuery } from '@mcro/models'
import { Logger } from '@mcro/logger'

const log = new Logger('getSearchQuery')

export const getSearchQuery = (args: SearchQuery) => {
  log.info('args', args)
  const {
    query,
    sortBy,
    take,
    skip = 0,
    startDate,
    endDate,
    integrationFilters,
    peopleFilters,
    locationFilters,
  } = args
  const findOptions: FindOptions<Bit> = {
    where: [],
    relations: {
      people: true,
      author: true,
    },
    take,
    skip,
  }

  const andConditions: any = {}
  if (startDate) {
    andConditions.bitCreatedAt = { $moreThan: new Date(startDate).getTime() }
  }
  if (endDate) {
    andConditions.bitCreatedAt = { $lessThan: new Date(endDate).getTime() }
  }
  if (integrationFilters && integrationFilters.length) {
    andConditions.integration = { $in: integrationFilters }
  }

  if (query.length) {
    const likeString = `%${query.replace(/\s+/g, '%')}%`
    // @ts-ignore
    findOptions.where.push({
      ...andConditions,
      title: { $like: likeString },
    })
    // @ts-ignore
    findOptions.where.push({
      ...andConditions,
      body: { $like: likeString },
    })
  }

  // SORT
  if (sortBy) {
    switch (sortBy) {
      case 'Topic':
      case 'Relevant':
        // TODO: i think it is this by default
        // once we do sprint on better search/hsf5 we can maybe make better
        break
      case 'Recent':
        findOptions.order = {
          bitCreatedAt: 'desc',
        }
        break
    }
  } else {
    findOptions.order = {
      bitCreatedAt: 'desc',
    }
  }

  if (peopleFilters && peopleFilters.length) {
    // essentially, find at least one person
    for (const name of peopleFilters) {
      // @ts-ignore
      findOptions.where.push({
        ...andConditions,
        people: {
          name: { $like: `%${name}%` },
        },
      })
    }
  }

  if (locationFilters && locationFilters.length) {
    for (const location of locationFilters) {
      // @ts-ignore
      findOptions.where.push({
        location: {
          name: { $like: `%${location}%` },
        },
      })
    }
  }

  // @ts-ignore
  if (!findOptions.where.length) {
    if (Object.keys(andConditions).length) {
      findOptions.where = andConditions
    } else {
      findOptions.where = undefined
    }
  }

  return findOptions
}
