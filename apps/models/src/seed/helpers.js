import { Place, Document } from '../all'

export async function ensurePlace(object: Object) {
  if (!object.slug) {
    throw `No slug provided for ensurePlace`
  }
  const existing = await Place.get({ slug: object.slug }).exec()
  if (!existing) {
    const place = await Place.create(object)
    return {
      document: place.document,
      place,
    }
  }
}
