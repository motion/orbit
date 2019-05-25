import { isDefined } from '@o/utils'
import { useCallback, useRef, useState } from 'react'

// allows you to automatically handle uncontrolled props for a component

export function useUncontrolled<A extends Object>(props: A, config: { [key: string]: any }) {
  const prevProps = useRef({})
  const next = Object.keys(config).reduce(
    (result, fieldName) => {
      const defaultProp = defaultKey(fieldName)
      const { [defaultProp]: defaultValue, [fieldName]: propsValue, ...rest } = result
      const handlerName = config[fieldName]
      const [stateValue, setState] = useState(defaultValue)
      const curProp = isDefined(props[fieldName])
      const wasProp = isDefined(prevProps.current[fieldName])

      if (!curProp && wasProp) {
        setState(defaultValue)
      }

      const propsHandler = props[handlerName]

      const handler = useCallback(
        (value, ...args) => {
          if (propsHandler) propsHandler(value, ...args)
          setState(value)
        },
        [setState, propsHandler],
      )

      if (!isDefined(defaultValue)) {
        return rest
      }

      return {
        ...rest,
        [fieldName]: curProp ? propsValue : stateValue,
        [handlerName]: handler,
      }
    },
    props as any,
  )
  prevProps.current = props
  return next
}

function defaultKey(key: string) {
  return 'default' + key.charAt(0).toUpperCase() + key.substr(1)
}
