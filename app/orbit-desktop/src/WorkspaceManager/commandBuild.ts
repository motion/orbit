import { updateBuildInfo } from '@o/apps-manager'
import { isOrbitApp, readPackageJson } from '@o/libs-node'
import { Logger } from '@o/logger'
import { AppDefinition, CommandBuildOptions, StatusReply } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'
import webpack = require('webpack')

import { commandGenTypes } from './commandGenTypes'
import { getAppParams } from './getAppsConfig'
import { makeWebpackConfig } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('commandBuild')

export async function commandBuild(options: CommandBuildOptions): Promise<StatusReply> {
  log.info(`Running build in ${options.projectRoot}`)

  if (!(await isOrbitApp(options.projectRoot))) {
    return {
      type: 'error',
      message: `\nNot inside an orbit app, add "config": { "orbitApp": true } } to the package.json`,
    }
  }

  try {
    const pkg = await readPackageJson(options.projectRoot)
    if (!pkg) {
      return {
        type: 'error',
        message: 'No package found!',
      }
    }

    const entry = await getAppEntry(options.projectRoot)
    if (!entry || !(await pathExists(entry))) {
      return {
        type: 'error',
        message: `Make sure your package.json "entry" specifies the full filename with extension, ie: main.tsx`,
      }
    }

    await Promise.all([
      bundleApp(entry, options),
      commandGenTypes({
        projectRoot: options.projectRoot,
        projectEntry: entry,
        out: join(options.projectRoot, 'dist', 'api.json'),
      }),
    ])

    return {
      type: 'success',
      message: 'Built app',
    }
  } catch (error) {
    return {
      type: 'error',
      message: `${error.message} ${error.stack}`,
    }
  }
}

export async function bundleApp(entry: string, options: CommandBuildOptions) {
  const verbose = true

  log.info(`Running orbit build: ${verbose} ${options.projectRoot}`)
  const pkg = await readPackageJson(options.projectRoot)

  // build appInfo first, we can then use it to determine if we need to build web/node
  const appInfoConf = await getAppInfoConfig(entry, pkg.name, options)
  log.info(`Building appInfo`, appInfoConf)
  await webpackPromise([appInfoConf], {
    loud: verbose,
  })

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

const monoRoot = join(__dirname, '..', '..', '..', '..')
const defaultBaseDll = {
  // default base dll
  manifest: join(monoRoot, 'example-workspace', 'dist', 'manifest-base.json'),
  filepath: join(monoRoot, 'example-workspace', 'dist', 'base.dll.js'),
}
if (process.env.NODE_ENV === 'production') {
  throw new Error(`Yo need to make this production ^^`)
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
async function getAppInfoConfig(entry: string, name: string, options: CommandBuildOptions) {
  return await makeWebpackConfig(
    {
      name,
      context: options.projectRoot,
      entry: [entry],
      target: 'node',
      mode: 'development',
      minify: false,
      noChunking: true,
      outputFile: 'appInfo.js',
      watch: options.watch,
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
            test: x => x !== entry,
            use: 'ignore-loader',
          },
        ],
      },
    },
  )
}

export async function getAppEntry(appRoot: string) {
  const pkg = await readJSON(join(appRoot, 'package.json'))
  return join(appRoot, `${pkg.main}`)
}
