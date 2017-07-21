import { replacer } from '~/views/editor/helpers'

export default [
  replacer(/^(\-docLinks)$/, 'docLinkList', { hashtag: 'foobar' }),
]
