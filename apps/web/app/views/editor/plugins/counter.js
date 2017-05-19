import { replacer } from './helpers'

export default [replacer(/^(\-counter)$/, 'counter', { count: 0 })]
