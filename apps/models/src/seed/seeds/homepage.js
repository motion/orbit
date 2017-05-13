import { ensurePlace } from '../helpers'

export const HOME_DOC_SLUG = '__home__'

export async function seedHome() {
  ensurePlace(HOME_DOC_SLUG, {
    document: {
      title: 'Welcome to Jot',
      authorId: 'admin',
    },
    place: {
      authorId: 'admin',
      title: 'Jot',
      private: false,
      members: ['admin'],
    },
  })
}
