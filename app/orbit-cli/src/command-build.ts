import { getAppConfig } from '@o/build-server'
import { ensureDir, pathExists, readJSON, writeJSON } from 'fs-extra'
import { join } from 'path'
import webpack = require('webpack')

import { commandGenTypes } from './command-gen-types'
import { reporter } from './reporter'
import { configStore } from './util/configStore'

type CommandBuildOptions = { projectRoot: string; watch?: boolean; force?: boolean }

export async function commandBuild(options: CommandBuildOptions) {
  if (await isBuildUpToDate(options)) {
    reporter.info(`App build is up to date, run with --force to force re-run`)
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

    // build web
  } catch (err) {
    reporter.error(err.message, err)
  }
}

type BuildInfo = {
  buildId: number
}

async function bundleApp(entry: string, pkg: any, options: CommandBuildOptions) {
  const nodeConf = await getNodeAppConfig(entry, pkg, options)
  const webConf = getWebAppConfig(entry, pkg, options)

  await webpack([nodeConf, webConf].filter(Boolean))

  const buildId = Date.now()
  await setBuildInfo(options.projectRoot, {
    buildId,
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
  })
}

async function getNodeAppConfig(entry: string, pkg: any, options: CommandBuildOptions) {
  // for now just check harcoded file
  if (!(await pathExists(join(options.projectRoot, 'src', 'index.node.ts')))) {
    console.log('No node api found')
    return
  }
  // TODO
  // seems like this is still picking up imports from index.ts,
  // ignore loader should still remove all things besides direct .node.ts imports
  return getAppConfig({
    name: pkg.name,
    context: options.projectRoot,
    entry: [entry],
    target: 'node',
    outputFile: 'index.node.js',
    watch: options.watch,
  })
}

async function isBuildUpToDate(options: CommandBuildOptions) {
  const config = configStore.appBuildInfo.get() || {}
  const configInfo = config[options.projectRoot]
  const buildInfo = await getBuildInfo(options.projectRoot)
  return configInfo && buildInfo && configInfo.buildId === buildInfo.buildId
}

async function setBuildInfo(projectRoot: string, next: BuildInfo) {
  await ensureDir(join(projectRoot, 'dist'))
  await writeJSON(join(projectRoot, 'dist', 'buildInfo.json'), next)
}

async function getBuildInfo(projectRoot: string): Promise<BuildInfo | null> {
  const file = join(projectRoot, 'dist', 'buildInfo.json')
  if (await pathExists(file)) {
    return (await readJSON(file)) as BuildInfo
  }
  return null
}
