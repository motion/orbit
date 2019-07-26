import { configStore } from '@o/config'
import { readPackageJson } from '@o/libs-node'
import { AppDefinition } from '@o/models'
import { ensureDir, pathExists, readJSON, writeJSON } from 'fs-extra'
import { join } from 'path'

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

const hasKey = (appInfo: AppDefinition, ...keys: string[]) =>
  Object.keys(appInfo).some(x => keys.some(key => x === key))

function getAppInfo(appRoot: string): AppDefinition {
  return require(join(appRoot, 'dist', 'appInfo.js')).default
}

export async function updateBuildInfo(appRoot: string) {
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

// TODO make it read real version in production/dev
function getOrbitVersion() {
  return require('../package.json').version
}

const buildInfoDir = x => join(x, 'dist', 'buildInfo.json')

async function setBuildInfo(projectRoot: string, next: BuildInfo) {
  await ensureDir(join(projectRoot, 'dist'))
  await writeJSON(buildInfoDir(projectRoot), next)
}

export async function getBuildInfo(projectRoot: string): BuildInfo | null {
  const dir = buildInfoDir(projectRoot)
  if (await pathExists(dir)) {
    return await readJSON(dir)
  }
  return null
}
