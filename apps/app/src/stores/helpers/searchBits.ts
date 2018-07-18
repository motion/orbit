import { Bit, Brackets, getRepository } from '@mcro/models'

export const searchBits = async (
  searchString,
  { take, skip, people, startDate, endDate },
) => {
  let query = getRepository(Bit)
    .createQueryBuilder('bit')
    .leftJoinAndSelect('bit.people', 'person')

  if (searchString.length) {
    query = query.andWhere(
      new Brackets(qb => {
        qb.where('bit.title like :searchString', { searchString })
        qb.orWhere('bit.body like :searchString', { searchString })
      }),
    )
  } else {
    // order by recent if no search
    query = query.order({ bitCreatedAt: 'DESC' })
  }

  if (people.length) {
    // essentially, find at least one person
    query = query.andWhere(
      new Brackets(qb => {
        qb.where('person.name like :name', { name: people[0] })
        for (const name of people.slice(1)) {
          qb.orWhere('person.name like :name', { name })
        }
      }),
    )
  }

  if (startDate) {
    query = query.where('bit.createdAt > :startDate', { startDate })
  }

  if (endDate) {
    query = query.where('bit.createdAt > :endDate', { endDate })
  }

  if (take) {
    query = query.take(take)
  }

  if (skip) {
    query = query.skip(skip)
  }

  console.log('query is', query)

  return await query.getMany()
}
