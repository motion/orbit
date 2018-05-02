export default ({ bit, children }) =>
  children({
    title: bit.title,
    icon: 'gdocs',
    location: bit.data.spaces[0],
    date: Date.now(),
    content: bit.body,
  })
