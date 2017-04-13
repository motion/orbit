import { glossy as $ } from 'helpers'

export const Page = $('section', {
  padding: [0, 10],
  flexFlow: 'row',
})

Page.Main = $('section', {
  padding: 10,
  minWidth: '70%',
  flex: 1,
})

Page.Side = $('section', {
  padding: 10,
})

export const Text = $('p', {
  fontSize: 16,
  lineHeight: '1.6rem',
  display: 'block'
})

export const Link = $('a', {
  color: 'red'
})

export const Quote = $('blockquote', {
  borderLeft: [2, '#eee'],
  padding: [5, 10],
  margin: 10,
})

export const Date = $('date', {
  color: '#999'
})

export Title from './title'
