// @flow
export default async function(info: Object) {
  const { id, created, updated } = info
  if (!id || !created || !updated) {
    throw new Error('Object must have properties: id, created, updated')
  }
  const stale = await this.get({ id, created: { $ne: created } })
  if (stale) {
    await stale.remove()
  }
  // already exists
  if (updated && (await this.get({ id, updated }))) {
    return false
  }
  // update
  const res = await this.update(info)
  return res
}
