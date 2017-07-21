import { replacer } from '~/views/editor/helpers'

export default [
  replacer(/^(\-docVotes)$/, 'docVoteList', { votes: '{}', hashtag: 'foobar' }),
]
