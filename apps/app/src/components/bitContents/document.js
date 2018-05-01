export default ({ result, children }) =>
  children({
    title: result.title,
    icon: 'gdoc',
    location: 'Folder',
    date: Date.now(),
    subtitle: result.integration,
    content: result.body,
  })
