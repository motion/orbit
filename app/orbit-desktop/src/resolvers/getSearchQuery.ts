import { FindOptions, FindOptionsWhere, FindOptionsWhereCondition } from 'typeorm'
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
    sourceId,
  } = args

  const findOptions: FindOptions<Bit> = {
    // select: {
    //   id: true,
    //   title: true,
    //   body: true,
    //   bitCreatedAt: true,
    //   bitUpdatedAt: true,
    //   createdAt: true,
    //   integration: true,
    //   type: true,
    //   people: true,
    //   location: { id: true, name: true, desktopLink: true, webLink: true },
    // },
    where: [],
    relations: {
      people: true,
      author: true,
    },
    take,
    skip,
  }

  const andConditions: FindOptionsWhere<Bit> = {}
  if (startDate) {
    andConditions.bitCreatedAt = {
      $moreThan: new Date(startDate).getTime()
    }
  }
  if (endDate) {
    andConditions.bitCreatedAt = {
      $lessThan: new Date(endDate).getTime()
    }
  }
  if (integrationFilters && integrationFilters.length) {
    andConditions.integration = { $in: integrationFilters }
  }
  if (sourceId) {
    andConditions.sourceId = sourceId
  }

  if (query.length) {
    const likeString = `%${query.replace(/\s+/g, '%')}%`
    ;(findOptions.where as FindOptionsWhereCondition<Bit>[]).push({
      ...andConditions,
      title: { $like: likeString },
    })
    ;(findOptions.where as FindOptionsWhereCondition<Bit>[]).push({
      ...andConditions,
      body: { $like: likeString },
    })
  }

  // SORT
  if (sortBy) {
    switch (sortBy) {
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
      (findOptions.where as FindOptionsWhereCondition<Bit>[]).push({
        ...andConditions,
        people: {
          name: { $like: `%${name}%` },
        },
      })
    }
  }

  if (locationFilters && locationFilters.length) {
    for (const location of locationFilters) {
      (findOptions.where as FindOptionsWhereCondition<Bit>[]).push({
        ...andConditions,
        location: {
          name: location,
        },
      })
    }
  }

  if (!(findOptions.where as FindOptionsWhereCondition<Bit>[]).length) {
    if (Object.keys(andConditions).length) {
      findOptions.where = andConditions
    } else {
      findOptions.where = undefined
    }
  }

  return findOptions
}