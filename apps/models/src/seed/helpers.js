import { Place, Document } from '../all'

export async function ensurePlace(slug, options = {}) {
  if (!await Place.get({ slug }).exec()) {
    const place = await Place.create({
      slug,
      ...options.place,
    })
    return {
      document: place.document,
      place,
    }
  }
}
