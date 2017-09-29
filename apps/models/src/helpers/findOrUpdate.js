import cleanId from './cleanId'

// @flow
export default async function findOrUpdate(doc: Object) {
  const { created, updated } = doc
  const id = cleanId(doc)
  if (!id || !created || !updated) {
    throw new Error('Object must have properties: id, created, updated')
  }
  const stale = await this.get({ id, created: { $ne: created } })
  if (stale) {
    await stale.remove()
  }
  // already exists
  if (await this.get({ id, updated })) {
    return false
  }
  // update
  const res = await this.update(doc)
  return res
}
