export const ResolveApp = ({ bit, children }) =>
  children({
    title: bit.title,
    icon: `/icons/${bit.icon}`,
  })
