export const ResolveApp = ({ model, children }) =>
  children({
    title: model.title,
    icon: `/icons/${model.icon}`,
  })
