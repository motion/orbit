import { glossy } from 'my-decorators'

export const Page = glossy('section', {
  padding: [0, 20],
})

export const Text = glossy('p', {
  fontSize: 19,
  lineHeight: '2rem',
  display: 'block'
})

export const Link = glossy('a', {
  color: 'red'
})
