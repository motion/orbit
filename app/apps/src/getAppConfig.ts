// this is mid-refactor in a sense
// appConfig is a weird setup, its used basically to pass from a index over to a main view
// it should be able to "set up" the main view
// technically it could be anything you want, but earlier we had it a bit more typed/setup
// this is sort of an awkward function to take certain things we understand and produce appConfig
// but then it also falls back to generically mapping over ListItem props
// works for now, but could be rethought

export function getAppConfig(props: OrbitListItemProps, id?: string): AppConfig {
  const { item } = props
  let type: string = ''
  if (item) {
    switch (item.target) {
      case 'bit':
        type = item.integration
        break
      case 'person-bit':
        type = 'person'
        break
    }
    if (type) {
      const app = allIntegrations[type]
      return sourceToAppConfig(app, item)
    }
  }
  return {
    id,
    ...listItemToAppConfig(props),
  }
}

function listItemToAppConfig(props: OrbitListItemProps): AppConfig {
  return {
    id: props.id,
    type: props.type,
    // dont accept react elements
    title: typeof props.title === 'string' ? props.title : undefined,
    icon: typeof props.icon === 'string' ? props.icon : undefined,
    subType: props.subType,
    ...props.appConfig,
  }
}
