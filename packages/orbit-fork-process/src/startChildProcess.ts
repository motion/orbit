import { getGlobalConfig } from '@mcro/config'
import { ChildProcess, spawn } from 'child_process'
import * as Path from 'path'

export type ChildProcessProps = {
  name: string
  isNode?: boolean
  env?: { [key: string]: any }
  inspectPort?: number
  inspectPortRemote?: number
}

export function startChildProcess({
  name = '',
  isNode = false,
  inspectPort = null,
  inspectPortRemote = null,
  env = {},
}: ChildProcessProps): ChildProcess {
  const Config = getGlobalConfig()
  const root = Path.join(__dirname, '..', 'main')
  let args = [root]

  if (!Config.isProd) {
    if (inspectPort) {
      args = [`--inspect=${inspectPort}`, ...args]
    }
    if (inspectPortRemote) {
      args = [`--remote-debugging-port=${inspectPortRemote}`, ...args]
    }
  }

  if (isNode) {
    env.ELECTRON_RUN_AS_NODE = 1
  }

  try {
    console.log(`Starting process ${name}:`, Config.paths.nodeBinary, args)
    const child = spawn(isNode || Config.isProd ? Config.paths.nodeBinary : 'electron', args, {
      env: {
        ...process.env,
        PROCESS_NAME: name,
        SUB_PROCESS: name,
        STACK_FILTER: name,
        NODE_ENV: process.env.NODE_ENV,
        ORBIT_CONFIG: JSON.stringify(Config),
        PATH: process.env.PATH,
        ...env,
      },
    })

    child.stdout.on('data', b => {
      console.log(`${name}: ${b.toString().replace(/\n$/, '')}`)
    })

    child.stderr.on('data', b => {
      const out = b.toString()
      if (/error/i.test(out) === false) {
        console.error('\nGot an error that may not be worth reporting:')
        console.error(`${name} error:`, out, '\n\n\n')
        return
      }
      console.error(`${name} error:`, out)
    })

    return child
  } catch (err) {
    console.log('error starting', name, err)
  }
}
