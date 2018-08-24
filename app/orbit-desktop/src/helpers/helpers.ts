import { getConnection } from 'typeorm'

export const sleep = ms => new Promise(res => setTimeout(res, ms))
export * from './createOrUpdate'

export async function findOrCreate(Model: any, values: Object) {
  let item = await Model.findOne({ where: values })
  if (item) {
    return item
  }
  item = new Model()
  Object.assign(item, values)
  return await item.save()
}

// helpers for queryBuilder
export const query = (query, params) => getConnection().query(query, params)

export const select = (model, query) =>
  getConnection()
    .createQueryBuilder(model)
    .select(query)

export const remove = model =>
  getConnection()
    .createQueryBuilder()
    .delete()
    .from(model)

export const update = model =>
  getConnection()
    .createQueryBuilder()
    .update(model)

export const insert = model =>
  getConnection()
    .createQueryBuilder()
    .insert()
    .into(model)
