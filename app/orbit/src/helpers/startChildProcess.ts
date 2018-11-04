import { spawn, ChildProcess } from 'child_process'
import { getGlobalConfig } from '@mcro/config'
import * as Path from 'path'

type Props = {
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
}: Props): ChildProcess {
  const Config = getGlobalConfig()
  const root = Path.join(__dirname, '..', 'main')
  let args = [root]

  if (!Config.isProd) {
    if (inspectPort) {
      args.push(`--inspect=${inspectPort}`)
    }
    if (inspectPortRemote) {
      args.push(`--remote-debugging-port=${inspectPortRemote}`)
    }
  }

  if (isNode) {
    env.ELECTRON_RUN_AS_NODE = 1
  }

  try {
    console.log(`Starting process ${name}:`, Config.paths.nodeBinary, args)
    const child = spawn(Config.paths.nodeBinary, args, {
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
      const error = b.toString()
      // for some reason node logs into error
      if (error.indexOf('Debugger ') === 0) {
        return
      }
      if (error.indexOf('Error') === -1) {
        console.log('\n\n\n got an error but may not be worth reporting:')
        console.log(`${name} error:`, error, '\n\n\n')
        return
      }
      console.log(`${name} error:`, error)
    })

    return child
  } catch (err) {
    console.log('error starting', name, err)
  }
}
