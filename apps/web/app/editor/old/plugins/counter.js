import { replacer } from '~/editor/helpers'

export default [replacer(/^(\-counter)$/, 'counter', { count: 0 })]
