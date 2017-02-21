import { glossy } from 'my-decorators'

export Title from './title'

export const Page = glossy('page', {
  padding: 10,
  flex: 1,
  overflowY: 'scroll',
})

export const Text = glossy('text', {
  fontSize: 22,
  lineHeight: '3rem'
})
