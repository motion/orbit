import { FindOptions } from 'typeorm'
import { Bit } from '@mcro/models'

export const getSearchQuery = ({
  query,
  sortBy,
  take,
  skip,
  startDate,
  endDate,
  integrationFilters,
  peopleFilters,
  locationFilters,
}) => {
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
    andConditions.bitCreatedAt = { $moreThan: startDate.getTime() }
  }
  if (endDate) {
    andConditions.bitCreatedAt = { $lessThan: endDate.getTime() }
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

  if (peopleFilters.length) {
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
