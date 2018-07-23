import { Bit, Brackets, getRepository } from '@mcro/models'
import debug from '@mcro/debug'

const log = debug('getSearchQuery')

export const getSearchQuery = (
  searchString,
  { take, skip, people, startDate, endDate },
) => {
  log('params', { take, skip, people, startDate, endDate })
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
  } else {
    // order by recent if no search
    query = query.orderBy('bit.bitCreatedAt', 'DESC')
  }

  if (people.length) {
    // essentially, find at least one person
    query = query.andWhere(
      new Brackets(qb => {
        const peopleLike = people.map(x => `%${x}%`)
        qb.where('person.name like :name', { name: peopleLike[0] })
        for (const name of peopleLike.slice(1)) {
          qb.orWhere('person.name like :name', { name })
        }
      }),
    )
  }

  if (startDate) {
    query = query.where('bit.bitCreatedAt > :startDate', { startDate })
  }

  if (endDate) {
    query = query.where('bit.bitCreatedAt < :endDate', { endDate })
  }

  if (take) {
    query = query.take(take)
  }

  if (skip) {
    query = query.skip(skip)
  }

  log('query', query)
  return query
}
