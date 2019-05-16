import { ensure, react } from '@o/automagical'
import { selectDefined } from '@o/utils'

export const syncFromProp = (
  props: any,
  controlledKey: string,
  defaultKey: string,
  defaultValue: any,
) => {
  const getValue = () => selectDefined(props[controlledKey], props[defaultKey])
  return react(() => getValue(), x => x, { defaultValue: selectDefined(getValue(), defaultValue) })
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
