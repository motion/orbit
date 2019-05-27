import { buildApp } from '@o/build-server'
import { ensureDir, pathExists, readJSON, writeJSON } from 'fs-extra'
import { join } from 'path'

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
  // build node
  await buildApp({
    name: pkg.name,
    context: options.projectRoot,
    entry: [entry],
    target: 'node',
    outputFile: 'index.node.js',
    watch: options.watch,
  })

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

async function isBuildUpToDate(options: CommandBuildOptions) {
  const configInfo = configStore.appBuildInfo.get()[options.projectRoot]
  const buildInfo = await getBuildInfo(options.projectRoot)
  return configInfo && buildInfo && configInfo.buildId === buildInfo.buildId
}

async function setBuildInfo(projectRoot: string, next: BuildInfo) {
  await ensureDir(join(projectRoot, 'dist'))
  await writeJSON(join(projectRoot, 'dist', 'buildInfo.json'), next)
}

async function getBuildInfo(projectRoot: string): Promise<BuildInfo | null> {
  const file = join(projectRoot, 'dist', 'buildInfo.json')
  if (!(await pathExists(file))) {
    return (await readJSON(file)) as BuildInfo
  }
  return null
}
