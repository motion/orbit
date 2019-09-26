import { Command } from '@o/mediator'
import { isDefined } from '@o/utils'
import { useCallback, useEffect, useState } from 'react'

import { Mediator } from './Mediator'

let cache: {
  [key: string]: {
    read: Promise<any>
    value: any
  }
} = {}

export function useCommand<Args, ReturnType>(
  command: Command<ReturnType, Args> | false,
  args: Args,
): ReturnType {
  const key = JSON.stringify({ args, name: command ? command.name : '' })
  const forceUpdate = useForceUpdate()

  // check if updated and refresh with new value if changed
  useEffect(() => {
    if (command === false) return
    let cancelled = false
    Mediator.command(command, args).then(res => {
      if (cancelled) return
      if (res !== cache[key].value) {
        cache[key].value = res
        forceUpdate()
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (command === false) {
    return null
  }

  if (cache[key]) {
    if (isDefined(cache[key].value)) {
      return cache[key].value
    }
    throw cache[key].read
  }

  if (__DEV__) {
    console.debug('useCommand', command, args)
  }

  cache[key] = {
    read: Mediator.command(command, args).then(res => {
      if (typeof res === 'undefined') {
        console.warn('this command returned undefined, will cause infinite loop, setting to null')
        res = null
      }
      cache[key].value = res
    }),
    value: undefined,
  }

  throw cache[key].read
}

function useForceUpdate() {
  const setState = useState(0)[1]
  return useCallback(() => {
    setState(Math.random())
  }, [])
}
