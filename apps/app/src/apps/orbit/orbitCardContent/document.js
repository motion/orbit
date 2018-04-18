export default ({ result, children }) =>
  children({
    title: result.title,
    subtitle: result.integration,
    content: result.body,
  })
