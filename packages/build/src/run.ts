import execa from 'execa'
import * as Path from 'path'

import { getFlag } from './webpack.config'

process.env.NODE_ENV = process.env.NODE_ENV || getFlag('--prod') ? 'production' : 'development'

console.log('node env', process.env.NODE_ENV)

process.env.IS_RUNNING = 'true'

const configPath = require.resolve('./webpack.config')
const root = Path.join(__dirname, '..')

const argsIndex = process.argv.findIndex(x => /mcro-build$/.test(x))
const extraArgs = argsIndex >= 0 ? process.argv.slice(argsIndex + 1) : []

const cmd = `${root}/node_modules/.bin/webpack-dev-server`
let args = ['--config', configPath, ...extraArgs]

console.log(`Running ${cmd} ${args.join(' ')}`)

const proc = execa(cmd, args, {
  env: {
    ENTRY: `${process.cwd()}/src`,
  },
})

proc.stdout.pipe(process.stdout)
proc.stderr.pipe(process.stderr)
