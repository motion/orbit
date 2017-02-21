import { glossy } from 'my-decorators'

export Title from './title'

export const Page = glossy('page', {
  padding: [0, 20],
  flex: 1,
  overflowY: 'scroll',
})

export const Text = glossy('text', {
  fontSize: 19,
  lineHeight: '2rem'
})

export const Link = glossy('a', {
  color: 'red'
})
