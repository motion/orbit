export default ({ bit, children }) =>
  children({
    title: bit.title,
    icon: 'gdoc',
    location: 'Folder',
    date: Date.now(),
    subtitle: bit.integration,
    content: bit.body,
  })
