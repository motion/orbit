import { glossy } from 'my-decorators'

export Title from './title'

export const Page = glossy('page', {
  padding: [0, 20],
  flex: 1,
  overflowY: 'scroll',
})

export const Text = glossy('text', {
  fontSize: 22,
  lineHeight: '2.5rem'
})
