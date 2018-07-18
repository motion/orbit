import { Bit } from '@mcro/models'

export const searchBits = async (
  searchString,
  { query, people, startDate, endDate },
) => {
  if (!query) {
    return await Bit.find({
      take: 6,
      relations: ['people'],
      order: { bitCreatedAt: 'DESC' },
    })
  }
  const titleLike = searchString.replace(/\s+/g, '%')
  let where = `(title like "%${titleLike}%" or body like "%${titleLike}%")`
  if (people) {
    const peopleWhere = people
      .map(person => `(${person} like "%%")`)
      .join(' OR ')
    where = `${where} AND ${peopleWhere}`
  }
  if (startDate) {
    where = `${where} AND "bit"."createdAt" > ${startDate}`
  }
  if (endDate) {
    where = `${where} AND "bit"."createdAt" < ${endDate}`
  }
  const queryParams = {
    where,
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
    ...query,
  }
  console.log('querying', where)
  const res = await Bit.find(queryParams)
  return res
}
