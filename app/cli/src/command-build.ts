import { getAppConfig, makeWebpackConfig, webpackPromise } from '@o/build-server'
import { ensureDir, pathExists, readJSON, writeJSON } from 'fs-extra'
import { join } from 'path'

import { commandGenTypes } from './command-gen-types'
import { reporter } from './reporter'
import { configStore } from './util/configStore'
import { AppDefinition } from '@o/models'

export type CommandBuildOptions = {
  projectRoot: string
  watch?: boolean
  force?: boolean
  verbose?: boolean
  // we can do more careful building for better errors
  debugBuild?: boolean
  // if you dont want to build the whole thing in dev mode
  onlyInfo?: boolean
}

export async function commandBuild(options: CommandBuildOptions) {
  reporter.info(`Running build in ${options.projectRoot}`)

  if (!(await isOrbitApp(options.projectRoot))) {
    reporter.panic(
      `\nNot inside an orbit app, add "config": { "orbitApp": true } } to the package.json`,
    )
    return
  }

  try {
    const pkg = await readPackageJson(options.projectRoot)
    if (!pkg) {
      reporter.error('No package found!')
      return null
    }

    const entry = join(options.projectRoot, pkg['ts:main'] || pkg.main)

    if (!entry || !(await pathExists(entry))) {
      reporter.error(`No main entry found at ${entry}`)
      return null
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

    reporter.success('Built app')
  } catch (err) {
    reporter.error(err.message, err)
  }
}

type BuildInfo = {
  appVersion: string
  orbitVersion: string
  buildId: number
  identifier: string
  name: string
  api: boolean
  app: boolean
  graph: boolean
  workers: boolean
}

export const isOrbitApp = async (rootDir: string) => {
  const pkg = await readPackageJson(rootDir)
  return pkg && pkg.config && pkg.config.orbitApp === true
}

async function readPackageJson(appRoot: string) {
  const packagePath = join(appRoot, 'package.json')
  reporter.verbose(`isOrbitApp ${packagePath}`)
  if (!(await pathExists(packagePath))) {
    return null
  }
  try {
    return await readJSON(packagePath)
  } catch (err) {
    reporter.error(err.message, err)
  }
  return null
}

function getOrbitVersion() {
  return require('../package.json').version
}

export async function bundleApp(entry: string, options: CommandBuildOptions) {
  reporter.info(`Running orbit build`)
  const pkg = await readPackageJson(options.projectRoot)

  // build appInfo first, we can then use it to determine if we need to build web/node
  reporter.info(`Building appInfo`)
  const appInfoConf = await getAppInfoConfig(entry, pkg.name, options)
  await webpackPromise([appInfoConf], {
    loud: options.verbose,
  })

  reporter.info(`Reading appInfo`)
  const appInfo = getAppInfo(options.projectRoot)
  reporter.info(`apiInfo: ${Object.keys(appInfo).join(',')}`)

  if (hasKey(appInfo, 'app')) {
    reporter.info(`Found web app, building`)
    const webConf = getWebAppConfig(entry, pkg.name, options)
    await webpackPromise([webConf], {
      loud: options.verbose,
    })
  }

  if (hasKey(appInfo, 'graph', 'workers', 'api')) {
    reporter.info(`Found node app, building`)
    const nodeConf = await getNodeAppConfig(entry, pkg.name, options)
    await webpackPromise([nodeConf], {
      loud: options.verbose,
    })
  }

  reporter.info(`Writing out app build information`)

  await updateBuildInfo(options.projectRoot)
}

const hasKey = (appInfo: AppDefinition, ...keys: string[]) =>
  Object.keys(appInfo).some(x => keys.some(key => x === key))

function getAppInfo(appRoot: string): AppDefinition {
  return require(join(appRoot, 'dist', 'appInfo.js')).default
}

async function updateBuildInfo(appRoot: string) {
  const appInfo = getAppInfo(appRoot)
  const pkg = await readPackageJson(appRoot)
  const buildId = Date.now()
  await setBuildInfo(appRoot, {
    identifier: appInfo.id,
    name: appInfo.name,
    buildId,
    appVersion: pkg ? pkg.version : '0.0.0',
    orbitVersion: getOrbitVersion(),
    api: hasKey(appInfo, 'api'),
    app: hasKey(appInfo, 'app'),
    graph: hasKey(appInfo, 'graph'),
    workers: hasKey(appInfo, 'workers'),
  })
  const appBuildInfo = configStore.appBuildInfo.get() || {}
  configStore.appBuildInfo.set({
    ...appBuildInfo,
    [appRoot]: {
      buildId,
    },
  })
}

async function setBuildInfo(projectRoot: string, next: BuildInfo) {
  await ensureDir(join(projectRoot, 'dist'))
  await writeJSON(join(projectRoot, 'dist', 'buildInfo.json'), next)
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
