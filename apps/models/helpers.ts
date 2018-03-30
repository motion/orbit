export async function findOrCreate(Model: any, values: Object) {
  let item = await Model.findOne(values)
  if (item) {
    return item
  }
  item = new Model()
  Object.assign(item, values)
  return await item.save()
}

export async function createOrUpdate(Model: any, values: Object) {
  let item = (await Model.findOne(values)) || new Model()
  Object.assign(item, values)
  await item.save()
  return item
}
