import { getAppConfig, makeWebpackConfig, webpackPromise } from '@o/build-server'
import { ensureDir, pathExists, readJSON, writeJSON } from 'fs-extra'
import { join } from 'path'

import { commandGenTypes } from './command-gen-types'
import { reporter } from './reporter'
import { configStore } from './util/configStore'

export type CommandBuildOptions = {
  projectRoot: string
  watch?: boolean
  force?: boolean
  verbose?: boolean
  // we can do more careful building for better errors
  debugBuild?: boolean
}

export const isOrbitApp = async (rootDir: string) => {
  const packagePath = join(rootDir, 'package.json')
  reporter.verbose(`isOrbitApp ${packagePath}`)
  if (!(await pathExists(packagePath))) {
    return false
  }
  try {
    const pkg = await readJSON(packagePath)
    return pkg.config && pkg.config.orbitApp === true
  } catch (err) {
    reporter.error(err.message, err)
  }
  return false
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
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    if (!pkg) {
      console.error('No package found!')
      return null
    }

    const entry = join(options.projectRoot, pkg['ts:main'] || pkg.main)

    if (!entry || !(await pathExists(entry))) {
      console.error(`No main entry found at ${entry}`)
      return null
    }

    await Promise.all([
      // bundle app
      bundleApp(entry, pkg, options),
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

function getOrbitVersion() {
  return require('../package.json').version
}

async function bundleApp(entry: string, pkg: any, options: CommandBuildOptions) {
  reporter.info(`Running orbit build`)

  // build appInfo first, we can then use it to determine if we need to build web/node
  reporter.info(`Building appInfo`)
  const appInfoConf = await getAppInfoConfig(entry, pkg, options)
  await webpackPromise([appInfoConf], {
    loud: options.verbose,
  })

  reporter.info(`Reading appInfo`)
  const appInfo = require(join(options.projectRoot, 'dist', 'appInfo.js')).default
  reporter.info(`apiInfo: ${Object.keys(appInfo).join(',')}`)

  const hasKey = (...keys: string[]) => Object.keys(appInfo).some(x => keys.some(key => x === key))

  if (hasKey('app')) {
    reporter.info(`Found web app, building`)
    const webConf = getWebAppConfig(entry, pkg, options)
    await webpackPromise([webConf], {
      loud: options.verbose,
    })
  }

  if (hasKey('graph', 'workers', 'api')) {
    reporter.info(`Found node app, building`)
    const nodeConf = await getNodeAppConfig(entry, pkg, options)
    await webpackPromise([nodeConf], {
      loud: options.verbose,
    })
  }

  const buildId = Date.now()

  reporter.info(`Writing out app build information`)

  await setBuildInfo(options.projectRoot, {
    identifier: appInfo.id,
    name: appInfo.name,
    buildId,
    appVersion: pkg.version,
    orbitVersion: getOrbitVersion(),
    api: hasKey('api'),
    app: hasKey('app'),
    graph: hasKey('graph'),
    workers: hasKey('workers'),
  })

  const appBuildInfo = configStore.appBuildInfo.get() || {}
  configStore.appBuildInfo.set({
    ...appBuildInfo,
    [options.projectRoot]: {
      buildId,
    },
  })
}

function getWebAppConfig(entry: string, pkg: any, options: CommandBuildOptions) {
  return getAppConfig({
    name: pkg.name,
    context: options.projectRoot,
    entry: [entry],
    target: 'web', // TODO electron-renderer
    outputFile: 'index.js',
    watch: options.watch,
    mode: 'production',
    minify: false,
  })
}

async function getNodeAppConfig(entry: string, pkg: any, options: CommandBuildOptions) {
  return getAppConfig(
    {
      name: pkg.name,
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
async function getAppInfoConfig(entry: string, pkg: any, options: CommandBuildOptions) {
  return await makeWebpackConfig(
    {
      name: pkg.name,
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

async function setBuildInfo(projectRoot: string, next: BuildInfo) {
  await ensureDir(join(projectRoot, 'dist'))
  await writeJSON(join(projectRoot, 'dist', 'buildInfo.json'), next)
}

// async function isBuildUpToDate(options: CommandBuildOptions) {
//   const config = configStore.appBuildInfo.get() || {}
//   const configInfo = config[options.projectRoot]
//   const buildInfo = await getBuildInfo(options.projectRoot)
//   return configInfo && buildInfo && configInfo.buildId === buildInfo.buildId
// }

// async function getBuildInfo(projectRoot: string): Promise<BuildInfo | null> {
//   const file = join(projectRoot, 'dist', 'buildInfo.json')
//   if (await pathExists(file)) {
//     return (await readJSON(file)) as BuildInfo
//   }
//   return null
// }
