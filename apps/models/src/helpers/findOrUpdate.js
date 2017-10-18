import cleanId from './cleanId'
import debug from 'debug'

const log = debug('model')

// @flow
export default async function findOrUpdate(doc: Object) {
  const id = cleanId(doc)
  const { created, updated } = doc
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
  log('performing findOrUpdate.update', id)
  const res = await this.update(doc)
  return res
}
