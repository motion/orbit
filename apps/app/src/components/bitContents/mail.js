import * as Helpers from '~/helpers'

export default ({ bit, children }) =>
  children({
    title: bit.title,
    icon: 'gmail',
    location: Helpers.getHeaderFromShort(bit),
    date: Date.now(),
    content: bit.body,
    preview: 'electronic invoice, April 1, April 30',
  })
