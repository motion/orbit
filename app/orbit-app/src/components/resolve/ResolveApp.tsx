export const ResolveApp = ({ model, children }) =>
  children({
    id: model.id,
    type: 'app',
    title: model.title,
    icon: `/icons/${model.icon}`,
  })
