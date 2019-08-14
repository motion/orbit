import { updateBuildInfo } from '@o/apps-manager'
import { getGlobalConfig } from '@o/config'
import { isOrbitApp, readPackageJson } from '@o/libs-node'
import { Logger } from '@o/logger'
import { CommandOpts, resolveCommand } from '@o/mediator'
import { AppBuildCommand, AppDefinition, CommandBuildOptions, StatusReply } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'
import webpack = require('webpack')

import { commandGenTypes } from './commandGenTypes'
import { attachLogToCommand, statusReplyCommand } from './commandHelpers'
import { getAppParams } from './getAppsConfig'
import { makeWebpackConfig } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('resolveAppBuildCommand')

export const resolveAppBuildCommand = resolveCommand(
  AppBuildCommand,
  statusReplyCommand(commandBuild),
)

export async function commandBuild(
  props: CommandBuildOptions,
  options?: CommandOpts,
): Promise<StatusReply> {
  attachLogToCommand(log, options)

  log.info(`Running build in ${props.projectRoot}`)

  if (!(await isOrbitApp(props.projectRoot))) {
    return {
      type: 'error',
      message: `\nNot inside an orbit app, add "config": { "orbitApp": true } } to the package.json`,
    }
  }

  const pkg = await readPackageJson(props.projectRoot)
  if (!pkg) {
    return {
      type: 'error',
      message: 'No package found!',
    }
  }

  const entry = await getAppEntry(props.projectRoot)
  if (!entry || !(await pathExists(entry))) {
    return {
      type: 'error',
      message: `Make sure your package.json "entry" specifies the full filename with extension, ie: main.tsx`,
    }
  }

  await Promise.all([
    bundleApp(props),
    commandGenTypes(
      {
        projectRoot: props.projectRoot,
        projectEntry: entry,
        out: join(props.projectRoot, 'dist', 'api.json'),
      },
      options,
    ),
  ])

  return {
    type: 'success',
    message: 'Built app',
  }
}

export async function buildAppInfo(
  options: CommandBuildOptions = {
    projectRoot: '',
    watch: false,
  },
): Promise<StatusReply> {
  try {
    const directory = options.projectRoot
    const entry = await getAppEntry(options.projectRoot)
    const pkg = await readPackageJson(directory)
    if (!pkg) {
      return {
        type: 'error',
        message: `No package.json at ${directory}`,
      }
    }
    // build appInfo first, we can then use it to determine if we need to build web/node
    const appInfoConf = await getAppInfoConfig(entry, pkg.name, options)
    log.info(`Building appInfo...`, appInfoConf)
    await webpackPromise([appInfoConf], {
      loud: true,
    })
    return {
      type: 'success',
      message: `Built successfully`,
    }
  } catch (err) {
    return {
      type: 'error',
      message: err.message,
      errors: [err],
    }
  }
}

export async function bundleApp(options: CommandBuildOptions) {
  const verbose = true // !
  const entry = await getAppEntry(options.projectRoot)
  const pkg = await readPackageJson(options.projectRoot)

  const appInfoRes = await buildAppInfo(options)
  if (appInfoRes.type !== 'success') {
    throw appInfoRes.errors ? appInfoRes.errors[0] : appInfoRes.message
  }

  const appInfo = await getAppInfo(options.projectRoot)
  log.info(`appInfo`, appInfo)

  if (!appInfo) {
    throw new Error(`No appInfo export default found`)
  }

  let webConf: webpack.Configuration | null = null
  let nodeConf: webpack.Configuration | null = null

  if (hasKey(appInfo, 'app')) {
    log.info(`Found web app, building`)
    webConf = await getWebAppConfig(entry, pkg.name, options)
  }

  if (hasKey(appInfo, 'graph', 'workers', 'api')) {
    log.info(`Found node app, building`)
    nodeConf = await getNodeAppConfig(entry, pkg.name, options)
  }

  await webpackPromise([webConf, nodeConf].filter(Boolean), {
    loud: verbose,
  })

  log.info(`Writing out app build information`)

  await updateBuildInfo(options.projectRoot)
}

const hasKey = (appInfo: AppDefinition, ...keys: string[]) =>
  Object.keys(appInfo).some(x => keys.some(key => x === key))

function getAppInfo(appRoot: string): AppDefinition | null {
  try {
    const path = join(appRoot, 'dist', 'appInfo.js')
    log.info(`getAppInfo ${path}`)
    return require(path).default
  } catch (err) {
    log.error(err.message, err)
    return null
  }
}

// default base dll
let defaultBaseDll
if (process.env.NODE_ENV === 'production') {
  const Config = getGlobalConfig()
  defaultBaseDll = {
    manifest: join(Config.paths.desktopRoot, 'dist', 'manifest-base.json'),
    filepath: join(Config.paths.desktopRoot, 'dist', 'baseDev.dll.js'),
  }
} else {
  const monoRoot = join(__dirname, '..', '..', '..', '..')
  defaultBaseDll = {
    manifest: join(monoRoot, 'example-workspace', 'dist', 'production', 'manifest-base.json'),
    filepath: join(monoRoot, 'example-workspace', 'dist', 'production', 'baseDev.dll.js'),
  }
}

async function getWebAppConfig(entry: string, name: string, options: CommandBuildOptions) {
  return await makeWebpackConfig(
    getAppParams({
      name,
      context: options.projectRoot,
      entry: [entry],
      target: 'web', // TODO electron-renderer
      outputFile: 'index.js',
      watch: options.watch,
      mode: 'production',
      minify: false,
      hot: false,
      dllReferences: [defaultBaseDll],
    }),
  )
}

async function getNodeAppConfig(entry: string, name: any, options: CommandBuildOptions) {
  return await makeWebpackConfig(
    getAppParams({
      name,
      context: options.projectRoot,
      entry: [entry],
      target: 'node',
      outputFile: 'index.node.js',
      watch: options.watch,
      mode: 'development',
      dllReferences: [defaultBaseDll],
    }),
    {
      node: {
        __dirname: false,
        __filename: false,
      },
      externals: [
        // externalize everything but local files
        function(_context, request, callback) {
          const isLocal = request[0] === '.' || request === entry
          if (!isLocal) {
            return callback(null, 'commonjs ' + request)
          }
          // @ts-ignore
          callback()
        },
      ],
    },
  )
}

// used just to get the information like id/name from the entry file
async function getAppInfoConfig(
  entry: string,
  name: string,
  options: Pick<CommandBuildOptions, 'projectRoot' | 'watch'>,
) {
  return await makeWebpackConfig(
    {
      name,
      context: options.projectRoot,
      entry: [entry],
      target: 'node',
      mode: 'development',
      devtool: 'inline-source-map',
      minify: false,
      outputFile: 'appInfo.js',
      watch: options.watch || false,
      output: {
        library: '[name]',
        libraryTarget: 'umd',
      },
    },
    {
      externals: {
        '@o/kit': '@o/kit/export-app',
      },
      module: {
        // ignore *everything* outside entry
        rules: [
          {
            test: x => {
              return x !== entry
            },
            use: 'ignore-loader',
          },
        ],
      },
    },
  )
}

export async function getAppEntry(appRoot: string, packageJson?: any) {
  const pkg = packageJson || (await readJSON(join(appRoot, 'package.json')))
  return join(appRoot, `${pkg.main}`)
}
