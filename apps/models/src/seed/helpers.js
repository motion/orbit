import { Place, Document } from '../all'

export async function ensurePlace(slug, options = {}) {
  // TODO get

  if (!await Place.get(HOME_DOC).exec()) {
    const document = await Document.create({
      ...options.document,
      places: [slug],
      home: true,
    })
    const place = await Place.create({
      slug,
      primary_docId: document._id,
      ...options.place,
    })
  }

  return {
    document,
    place,
  }
}
