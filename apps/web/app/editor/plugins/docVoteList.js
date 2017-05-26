import { replacer } from './helpers'

export default [
  replacer(/^(\-docVotes)$/, 'docVoteList', { votes: '{}', hashtag: 'foobar' }),
]
