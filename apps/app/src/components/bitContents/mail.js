import * as UI from '@mcro/ui'

export default ({ bit, children }) =>
  children({
    title: bit.title,
    icon: 'gmail',
    location: 'Inbox',
    date: Date.now(),
    subtitle: <UI.Date>{new Date(bit.bitUpdatedAt)}</UI.Date>,
    preview: bit.body,
    content: bit.body,
  })
