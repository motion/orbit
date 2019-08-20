import { getGlobalConfig } from '@o/config'
import { isEqual } from '@o/kit'
import { isOrbitApp, readPackageJson } from '@o/libs-node'
import { Logger } from '@o/logger'
import { CommandOpts, resolveCommand } from '@o/mediator'
import { AppBuildCommand, AppDefinition, CommandBuildOptions, StatusReply } from '@o/models'
import { ensureDir, pathExists, readJSON, writeJSON } from 'fs-extra'
import { join } from 'path'
import webpack from 'webpack'

import { buildAppInfo } from './buildAppInfo'
import { commandGenTypes } from './commandGenTypes'
import { attachLogToCommand, statusReplyCommand } from './commandHelpers'
import { getAppParams } from './getAppsConfig'
import { makeWebpackConfig } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

export const log = new Logger('resolveAppBuildCommand')

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

  await ensureDir(join(props.projectRoot, 'dist'))

  if (!(await hasChangedAppHash(props.projectRoot))) {
    log.info(`App hasn't changed, not rebuilding. To force build, run: orbit build --force`)
    return
  }

  const [resBundle, resGenType] = await Promise.all([
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

  if (resBundle.type !== 'success') {
    return resBundle
  }
  if (resGenType.type !== 'success') {
    return resGenType
  }

  return {
    type: 'success',
    message: 'Built app',
  }
}

export async function bundleApp(options: CommandBuildOptions): Promise<StatusReply> {
  const verbose = true // !
  const entry = await getAppEntry(options.projectRoot)
  const pkg = await readPackageJson(options.projectRoot)

  const appHash = await getAppHash(options.projectRoot)
  const appInfoRes = await buildAppInfo(options)
  if (appInfoRes.type !== 'success') {
    return appInfoRes
  }
  const appInfo = appInfoRes.value

  let webConf: webpack.Configuration | null = null
  let nodeConf: webpack.Configuration | null = null

  if (hasKey(appInfo, 'graph', 'workers', 'api')) {
    log.info(`Has node app...`)
    nodeConf = await getNodeAppConfig(entry, pkg.name, options)
  }

  const configs = [webConf, nodeConf].filter(Boolean)
  if (configs.length) {
    log.info(`Building...`)
    await webpackPromise(configs, {
      loud: verbose,
    })
  }

  await writeBuildInfo(options.projectRoot, appHash)

  return {
    type: 'success',
    message: `Bundled app`,
  }
}

const folderHash = require('folder-hash')

async function getAppHash(appDir: string) {
  return await folderHash.hashElement(appDir, {
    folders: { exclude: ['node_modules', 'test', 'dist', '.*'] },
    files: { include: ['*.js', '*.json', '*.ts', '*.tsx'] },
  })
}

async function writeBuildInfo(appDir: string, appHash) {
  const file = join(appDir, 'dist', 'buildInfo.json')
  return await writeJSON(file, appHash)
}

async function readBuildInfo(appDir: string) {
  const file = join(appDir, 'dist', 'buildInfo.json')
  try {
    return await readJSON(file)
  } catch {
    return null
  }
}

async function hasChangedAppHash(appDir: string) {
  const current = await getAppHash(appDir)
  const existing = await readBuildInfo(appDir)
  return isEqual(current, existing) === false
}

const hasKey = (appInfo: AppDefinition, ...keys: string[]) =>
  Object.keys(appInfo).some(x => keys.some(key => x === key))

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

export async function getNodeAppConfig(entry: string, name: any, options: CommandBuildOptions) {
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

export async function getAppEntry(appRoot: string, packageJson?: any) {
  const pkg = packageJson || (await readJSON(join(appRoot, 'package.json')))
  return join(appRoot, `${pkg.main}`)
}
