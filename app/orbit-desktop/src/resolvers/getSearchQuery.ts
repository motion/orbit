import { FindOptions, FindOptionsWhere, FindOptionsWhereCondition } from 'typeorm'
import { Bit, SearchQuery } from '@mcro/models'

export const getSearchQuery = (args: SearchQuery) => {
  const {
    ids,
    query,
    sortBy,
    take,
    skip = 0,
    startDate,
    endDate,
    integrationFilters,
    peopleFilters,
    locationFilters,
    spaceId,
    sourceId,
    contentType,
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
  if (ids) {
    andConditions.id = { $in: ids }
  }
  if (contentType) {
    andConditions.type = contentType
  }
  if (startDate && endDate) {
    andConditions.bitCreatedAt = {
      $between: [new Date(startDate).getTime(), new Date(endDate).getTime()]
    }

  } else if (startDate) {
    andConditions.bitCreatedAt = {
      $moreThan: new Date(startDate).getTime()
    }
  } else if (endDate) {
    andConditions.bitCreatedAt = {
      $lessThan: new Date(endDate).getTime()
    }
  }
  if (integrationFilters && integrationFilters.length) {
    andConditions.integration = { $in: integrationFilters }
  }
  if (sourceId || spaceId) {
    andConditions.source = {
      id: sourceId ? sourceId : undefined,
      spaceId: spaceId ? spaceId : undefined,
    }
  }

  if (query && query.length) {
    andConditions.title = { $like: `%${query.replace(/\s+/g, '%')}%` }
  }

  (findOptions.where as FindOptionsWhereCondition<Bit>[]).push(andConditions)

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