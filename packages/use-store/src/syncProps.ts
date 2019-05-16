import { ensure, react } from '@o/automagical'

export const syncFromProp = (props: any, key: string, defaultValue: any) => {
  return react(() => props[key], x => x, { defaultValue })
}

export const syncToProp = (store: any, key: string, propKey: string) => {
  return react(
    () => store[key],
    val => {
      ensure(`has prop ${propKey}`, !!store.props[propKey])
      store.props[propKey](val)
    },
    {
      deferFirstRun: true,
    },
  )
}
