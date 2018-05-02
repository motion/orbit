import * as UI from '@mcro/ui'
import * as Helpers from '~/helpers'

export default ({ bit, children }) =>
  children({
    title: bit.title,
    icon: 'gmail',
    location: Helpers.getHeaderFromShort(bit),
    date: Date.now(),
    subtitle: <UI.Date>{new Date(bit.bitUpdatedAt)}</UI.Date>,
    preview: bit.body,
    content: bit.body,
  })
