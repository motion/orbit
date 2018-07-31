import { Bit, Brackets, getRepository } from '@mcro/models'

export const getSearchQuery = (
  searchString,
  { take, skip, startDate, endDate, sortBy },
) => {
  let query = getRepository(Bit)
    .createQueryBuilder('bit')
    .leftJoinAndSelect('bit.people', 'person')

  if (searchString.length) {
    const likeString = `%${searchString.replace(/\s+/g, '%')}%`
    query = query.andWhere(
      new Brackets(qb => {
        qb.where('bit.title like :likeString', { likeString })
        qb.orWhere('bit.body like :likeString', { likeString })
      }),
    )
  }

  // SORT
  if (sortBy) {
    switch (sortBy) {
      case 'Relevant':
        // TODO: i think it is this by default
        // once we do sprint on better search/hsf5 we can maybe make better
        break
      case 'Recent':
        query = query.orderBy('bit.bitCreatedAt', 'DESC')
        break
    }
  } else {
    // order by recent if no search
    query = query.orderBy('bit.bitCreatedAt', 'DESC')
  }

  // DATE RANGE
  if (startDate) {
    query = query.where('bit.bitCreatedAt > :startDate', { startDate })
  }
  if (endDate) {
    query = query.where('bit.bitCreatedAt < :endDate', { endDate })
  }

  // PAGINATION
  if (take) {
    query = query.take(take)
  }
  if (skip) {
    query = query.skip(skip)
  }

  return query
}
