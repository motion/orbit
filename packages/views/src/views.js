import { glossy } from 'my-decorators'

export const Page = glossy('section', {
  padding: [0, 20],
  flex: 1,
  overflowY: 'scroll',
})

export const Text = glossy('p', {
  fontSize: 19,
  lineHeight: '2rem',
  display: 'block'
})

export const Link = glossy('a', {
  color: 'red'
})
