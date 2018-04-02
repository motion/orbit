import { pick } from 'lodash'

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
) {
  const finalFields = findFields ? pick(values, findFields) : values
  let item = (await Model.findOne({ where: finalFields })) || new Model()
  Object.assign(item, values)
  await item.save()
  return item
}
