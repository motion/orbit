import * as UI from '@mcro/ui'

export default ({ result, children }) =>
  children({
    title: result.title,
    icon: 'gmail',
    location: 'Inbox',
    date: Date.now(),
    subtitle: <UI.Date>{new Date(result.bitUpdatedAt)}</UI.Date>,
    preview: result.body,
    content: result.body,
  })
