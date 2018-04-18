import { pick, isEqual } from 'lodash'
import { getConnection } from './typeorm'

export const sleep = ms => new Promise(res => setTimeout(res, ms))

export * from './typeorm'
// import { BaseEntity } from 'typeorm'

export async function findOrCreate(Model: any, values: Object) {
  let item = await Model.findOne(values)
  if (item) {
    return item
  }
  item = new Model()
  Object.assign(item, values)
  return await item.save()
}

export async function createOrUpdate(
  Model: any,
  values: Object,
  findFields?: Array<string>,
  returnIfUnchanged = false,
) {
  const finalFields = findFields ? pick(values, findFields) : values
  let item = (await Model.findOne({ where: finalFields })) || new Model()
  const itemVals = Object.keys(values).reduce(
    (a, b) => ({ ...a, [b]: item[b] }),
    {},
  )
  const changed = !isEqual(itemVals, values)
  if (!returnIfUnchanged && !changed) {
    return null
  }
  if (changed) {
    Object.assign(item, values)
    await item.save()
  }
  return item
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
