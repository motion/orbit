import execa from 'execa'
import * as Path from 'path'

process.env.IS_RUNNING = 'true'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const configPath = require.resolve('./webpack.config')
const root = Path.join(__dirname, '..')

const argsIndex = process.argv.findIndex(x => /mcro-build$/.test(x))
const extraArgs = argsIndex >= 0 ? process.argv.slice(argsIndex + 1) : []

const cmd = `${root}/node_modules/.bin/webpack-dev-server`
let args = ['--color', '--config', configPath, ...extraArgs]

console.log(`Running ${cmd} ${args.join(' ')}`)

const proc = execa(cmd, args, {
  maxBuffer: 750_000_000,
})

proc.stdout.pipe(process.stdout)
proc.stderr.pipe(process.stderr)
