import { updateBuildInfo } from '@o/apps-manager'
import { Logger } from '@o/logger'
import { AppDefinition, CommandBuildOptions } from '@o/models'
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'
import { isOrbitApp, readPackageJson } from '@o/libs-node'

import { commandGenTypes } from './commandGenTypes'
import { getAppConfig } from './getAppConfig'
import { makeWebpackConfig } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('AppCreateNewCommand')

export async function commandBuild(options: CommandBuildOptions) {
  log.info(`Running build in ${options.projectRoot}`)

  if (!(await isOrbitApp(options.projectRoot))) {
    return {
      type: 'error',
      message: `\nNot inside an orbit app, add "config": { "orbitApp": true } } to the package.json`,
    } as const
  }

  try {
    const pkg = await readPackageJson(options.projectRoot)
    if (!pkg) {
      return {
        type: 'error',
        message: 'No package found!',
      } as const
    }

    const entry = await getAppEntry(options.projectRoot)

    if (!entry || !(await pathExists(entry))) {
      return {
        type: 'error',
        message: `Make sure your package.json "entry" specifies the full filename with extension, ie: main.tsx`,
      } as const
    }

    await Promise.all([
      // bundle app
      bundleApp(entry, options),
      // generate api types
      commandGenTypes({
        projectRoot: options.projectRoot,
        projectEntry: entry,
        out: join(options.projectRoot, 'dist', 'api.json'),
      }),
    ])

    return {
      type: 'success',
      message: 'Built app',
    } as const
  } catch (error) {
    return {
      type: 'error',
      message: error.message,
      error,
    } as const
  }
}

export async function bundleApp(entry: string, options: CommandBuildOptions) {
  log.info(`Running orbit build`)
  const pkg = await readPackageJson(options.projectRoot)

  // build appInfo first, we can then use it to determine if we need to build web/node
  log.info(`Building appInfo`)
  const appInfoConf = await getAppInfoConfig(entry, pkg.name, options)
  await webpackPromise([appInfoConf], {
    loud: options.verbose,
  })

  log.info(`Reading appInfo`)
  const appInfo = getAppInfo(options.projectRoot)
  log.info(`apiInfo: ${Object.keys(appInfo).join(',')}`)

  if (hasKey(appInfo, 'app')) {
    log.info(`Found web app, building`)
    const webConf = getWebAppConfig(entry, pkg.name, options)
    await webpackPromise([webConf], {
      loud: options.verbose,
    })
  }

  if (hasKey(appInfo, 'graph', 'workers', 'api')) {
    log.info(`Found node app, building`)
    const nodeConf = await getNodeAppConfig(entry, pkg.name, options)
    await webpackPromise([nodeConf], {
      loud: options.verbose,
    })
  }

  log.info(`Writing out app build information`)

  await updateBuildInfo(options.projectRoot)
}

const hasKey = (appInfo: AppDefinition, ...keys: string[]) =>
  Object.keys(appInfo).some(x => keys.some(key => x === key))

function getAppInfo(appRoot: string): AppDefinition {
  return require(join(appRoot, 'dist', 'appInfo.js')).default
}

function getWebAppConfig(entry: string, name: string, options: CommandBuildOptions) {
  return getAppConfig({
    name,
    context: options.projectRoot,
    entry: [entry],
    target: 'web', // TODO electron-renderer
    outputFile: 'index.js',
    watch: options.watch,
    mode: 'production',
    minify: false,
  })
}

async function getNodeAppConfig(entry: string, name: any, options: CommandBuildOptions) {
  return getAppConfig(
    {
      name,
      context: options.projectRoot,
      entry: [entry],
      target: 'node',
      outputFile: 'index.node.js',
      watch: options.watch,
      mode: 'development',
    },
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
