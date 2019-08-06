import { Logger, LogMiddleware } from '@o/logger'
import { CommandOpts } from '@o/mediator'
import commandExists from 'command-exists'
import exec from 'execa'

export async function npmCommand(args: string) {
  const cmd = await yarnOrNpm()
  await exec(cmd, args.split(' '))
}

export async function yarnOrNpm() {
  const hasYarn = await commandExists('yarn')
  const hasNpm = await commandExists('npm')
  if (!hasYarn && !hasNpm) {
    throw new Error(`Neither npm or yarn installed, need one of them to continue.`)
  }
  return hasYarn ? 'yarn' : 'npm'
}

/**
 * Catches errors during a command and returns them as the StatusReply
 * TODO type this properly and move into util fn, use for all status reply commands
 */
export function statusReplyCommand<A extends Function>(cb: A): A {
  const res = async (...args) => {
    try {
      return await cb(...args)
    } catch (error) {
      return {
        type: 'error',
        message: `${error.message}\n${error.stack}`,
      }
    }
  }
  return (res as any) as A
}

export function attachLogToCommand(log: Logger, options: CommandOpts) {
  const sendMessage: LogMiddleware = (level, _namespace, messages: string[]) => {
    if (level !== 'debug') {
      options.sendMessage(messages.join(' '))
    }
  }
  log.addMiddleware(sendMessage)
  options.onFinishCommand(() => {
    log.removeMiddleware(sendMessage)
  })
}
