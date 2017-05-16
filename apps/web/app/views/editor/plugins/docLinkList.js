import { replacer } from './helpers'

export default [
  replacer(/^(\-docLinks)$/, 'docLinkList', { hashtag: 'foobar' }),
]
