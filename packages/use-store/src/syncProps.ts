import { ensure, react } from '@o/automagical'
import { idFn, selectDefined } from '@o/utils'

export const syncFromProp = (
  props: any,
  options: {
    key: string
    defaultValue: any
    defaultKey?: string
    normalize?: (a: any) => any
  },
) => {
  const normalize = options.normalize || idFn
  const getValue = () =>
    selectDefined(props[options.key], options.defaultKey ? props[options.defaultKey] : undefined)
  return react(() => getValue(), normalize, {
    defaultValue: normalize(selectDefined(getValue(), options.defaultValue)),
  })
}

export const syncToProp = (store: any, key: string, propKey: string) => {
  return react(
    () => store[key],
    val => {
      ensure(`has prop ${propKey}`, !!store.props[propKey])
      store.props[propKey](val)
    },
    {
      lazy: true,
    },
  )
}
