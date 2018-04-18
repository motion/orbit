export default ({ result, children }) =>
  children({
    title: result.title,
    subtitle: 'Mail',
    content: result.body,
  })
