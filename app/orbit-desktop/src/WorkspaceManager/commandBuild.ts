import { getAppInfo } from '@o/apps-manager'
import { getGlobalConfig } from '@o/config'
import { isEqual } from '@o/fast-compare'
import { isOrbitApp, readPackageJson } from '@o/libs-node'
import { Logger } from '@o/logger'
import { CommandOpts, resolveCommand } from '@o/mediator'
import { AppBuildCommand, AppDefinition, CommandBuildOptions, StatusReply } from '@o/models'
import { stringHash } from '@o/utils'
import { ensureDir, pathExists, readFile, readJSON, writeJSON } from 'fs-extra'
import { omit } from 'lodash'
import { join } from 'path'
import webpack from 'webpack'

import { buildAppInfo } from './buildAppInfo'
import { commandGenTypes } from './commandGenTypes'
import { attachLogToCommand, statusReplyCommand } from './commandHelpers'
import { getNodeAppConfig } from './getNodeAppConfig'
import { webpackPromise } from './webpackPromise'

export const log = new Logger('commandBuild')

export const resolveAppBuildCommand = resolveCommand(
  AppBuildCommand,
  statusReplyCommand(commandBuild),
)

export async function commandBuild(
  props: CommandBuildOptions,
  options?: CommandOpts,
): Promise<StatusReply> {
  attachLogToCommand(log, options)
  const appRoot = props.projectRoot

  log.info(`Running build in ${appRoot}`)

  if (!(await isOrbitApp(appRoot))) {
    return {
      type: 'error',
      message: `\nNot inside an orbit app ${appRoot}, add "config": { "orbitApp": true } } to the package.json`,
    }
  }

  const pkg = await readPackageJson(appRoot)
  if (!pkg) {
    return {
      type: 'error',
      message: 'No package found!',
    }
  }

  const entry = await getAppEntry(appRoot)
  if (!entry || !(await pathExists(entry))) {
    return {
      type: 'error',
      message: `Make sure your package.json "entry" specifies the full filename with extension, ie: main.tsx`,
    }
  }

  await ensureDir(join(appRoot, 'dist'))

  if (!props.force && !(await shouldRebuildApp(appRoot))) {
    log.info(`App hasn't changed, not rebuilding. To force build, run: orbit build --force`)
    return {
      type: 'success',
      message: `Already built`,
    }
  }

  const [resBundle, resGenType] = await Promise.all([
    bundleApp(props),
    commandGenTypes(
      {
        projectRoot: appRoot,
        projectEntry: entry,
        out: join(appRoot, 'dist', 'api.json'),
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
  log.info(`Writing app info...`)
  const verbose = true // !
  const entry = await getAppEntry(options.projectRoot)
  const pkg = await readPackageJson(options.projectRoot)

  const appInfoRes = await buildAppInfo(options)
  if (appInfoRes.type !== 'success') {
    return appInfoRes
  }
  const appInfo = appInfoRes.value

  if (!appInfo) {
    return {
      type: 'error',
      message: `No appInfo generated?`,
    }
  }

  let webConf: webpack.Configuration | null = null
  let nodeConf: webpack.Configuration | null = null

  // TODO re-enable but make work with static serving app bundles / watching
  // if (hasKey(appInfo, 'app')) {
  //   log.info(`Has web app...`)
  //   nodeConf = await getNodeAppConfig(entry, pkg.name, options)
  // }

  if (hasKey(appInfo, 'graph', 'workers', 'api')) {
    log.info(`Found node entry...`)
    nodeConf = await getNodeAppConfig(entry, pkg.name, options)
  }

  const configs = [webConf, nodeConf].filter(Boolean)
  if (configs.length) {
    log.info(`Building app...`)
    await webpackPromise(configs, {
      loud: verbose,
    })
  }

  await writeBuildInfo(options.projectRoot)

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

async function getBuildInfo(appDir: string) {
  const appHash = await getAppHash(appDir)
  const appPackage = await readJSON(join(appDir, 'package.json'))
  const globalConfig = await getGlobalConfig()
  /// ..... brittle
  const configFiles = stringHash(
    (await Promise.all(
      [require.resolve('./makeWebpackConfig'), require.resolve('./getNodeAppConfig')].map(
        async x => {
          return await readFile(x)
        },
      ),
    )).join(''),
  )
  return {
    configFiles,
    appHash,
    appPackage,
    orbitConfig: stringHash(JSON.stringify(omit(globalConfig.paths, 'nodeBinary'))),
    version: globalConfig.version,
  }
}

async function writeBuildInfo(appDir: string) {
  const file = join(appDir, 'dist', 'buildInfo.json')
  return await writeJSON(file, await getBuildInfo(appDir))
}

async function readBuildInfo(appDir: string) {
  const file = join(appDir, 'dist', 'buildInfo.json')
  try {
    return await readJSON(file)
  } catch {
    return null
  }
}

async function isValidJSONFile(path: string) {
  try {
    await readJSON(path)
    return true
  } catch (err) {
    log.info(`Error reading json ${err.message}`)
    return false
  }
}

class ShouldRebuildMissingBuildInfo {}
class ShouldRebuildMissingAppInfo {}
class ShouldRebuildMissingApi {}
class ShouldRebuildMissingNodeApp {}
class ShouldRebuildNewBuildInfo {}

async function shouldRebuildApp(appRoot: string) {
  try {
    // do some basic sanity checks
    // no buildInfo yet
    if (!(await isValidJSONFile(join(appRoot, 'dist', 'buildInfo.json')))) {
      throw new ShouldRebuildMissingBuildInfo()
    }
    // no appInfo yet
    if (!(await isValidJSONFile(join(appRoot, 'dist', 'appInfo.json')))) {
      throw new ShouldRebuildMissingAppInfo()
    }
    // do some appInfo => output comparison checks
    const appInfo = await getAppInfo(appRoot)
    // ensure api file built
    if (appInfo.api && !(await isValidJSONFile(join(appRoot, 'dist', 'api.json')))) {
      throw new ShouldRebuildMissingApi()
    }
    // ensure node bundle built
    if (appInfo.workers || appInfo.graph) {
      if (!(await pathExists(join(appRoot, 'dist', 'index.node.js')))) {
        throw new ShouldRebuildMissingNodeApp()
      }
    }
    // ensure buildInfo hash is equal
    const current = await getBuildInfo(appRoot)
    const existing = await readBuildInfo(appRoot)
    if (isEqual(current, existing) === false) {
      if (current && existing) {
        for (const key in current) {
          if (!isEqual(current[key], existing[key])) {
            log.verbose(`changed on key ${key} old ${existing[key]} new ${current[key]}`)
          }
        }
      }
      throw new ShouldRebuildNewBuildInfo()
    }
    return false
  } catch (err) {
    log.verbose(`shouldRebuild! ${err.constructor.name}`)
    return true
  }
}

const hasKey = (appInfo: AppDefinition, ...keys: string[]) =>
  Object.keys(appInfo).some(x => keys.some(key => x === key))

export async function getAppEntry(appRoot: string, packageJson?: any) {
  const pkg = packageJson || (await readJSON(join(appRoot, 'package.json')))
  return join(appRoot, `${pkg.main}`)
}
