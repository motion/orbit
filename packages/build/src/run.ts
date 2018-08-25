import * as Path from 'path'
import execa from 'execa'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

console.log('node env', process.env.NODE_ENV)

const configPath = require.resolve('./webpack.config')
const root = Path.join(__dirname, '..')

const argsIndex = process.argv.findIndex(x => /mcro-build$/.test(x))
const extraArgs = argsIndex >= 0 ? process.argv.slice(argsIndex + 1) : []

const cmd = 'webpack-dev-server'
let args = ['--config', configPath, ...extraArgs]

if (process.env.NODE_ENV !== 'production') {
  args.push('--hot')
}

console.log(`Running ${cmd} ${args.join(' ')}`)

const proc = execa(cmd, args, {
  // cwd: root,
  env: {
    ENTRY: `${process.cwd()}/src`,
    WEBPACK_MODULES: Path.join(root, 'node_modules'),
  },
})

proc.stdout.pipe(process.stdout)
proc.stderr.pipe(process.stderr)
