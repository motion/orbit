import { glossy } from 'my-decorators'

export const Page = glossy('section', {
  padding: [0, 10],
})

export const Text = glossy('p', {
  fontSize: 16,
  lineHeight: '1.6rem',
  display: 'block'
})

export const Link = glossy('a', {
  color: 'red'
})

export const Quote = glossy('blockquote', {
  borderLeft: [2, '#eee'],
  padding: [5, 10],
  margin: 10,
})

export const Date = glossy('date', {
  color: '#999'
})
