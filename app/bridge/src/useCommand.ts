import { Command } from '@o/mediator'
import { isDefined } from '@o/utils'

import { Mediator } from './Mediator'

let cache: {
  [key: string]: {
    read: Promise<any>
    value: any
  }
} = {}

export function useCommand<Args, ReturnType>(
  command: Command<ReturnType, Args>,
  args: Args,
): ReturnType {
  const key = JSON.stringify({ args, name: command.name })

  if (cache[key] && isDefined(cache[key].value)) {
    return cache[key].value
  }

  cache[key] = {
    read: Mediator.command(command, args).then(res => {
      cache[key].value = res
      setTimeout(() => {
        delete cache[key]
      }, 10)
    }),
    value: undefined,
  }

  throw cache[key].read
}
