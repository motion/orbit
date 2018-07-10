export const File = ({ bit, children }) =>
  children({
    title: bit.title,
    body: bit.body,
  })
