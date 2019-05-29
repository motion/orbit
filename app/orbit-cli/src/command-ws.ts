import { BuildServer, getAppConfig, makeWebpackConfig, WebpackParams, webpackPromise } from '@o/build-server'
import { AppOpenWorkspaceCommand } from '@o/models'
import { pathExists, readJSON, writeFile } from 'fs-extra'
import { join } from 'path'

import { getIsInMonorepo, getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

type CommandWSOptions = {
  workspaceRoot: string
  clean: boolean
  mode: 'development' | 'production'
}

export async function commandWs(options: CommandWSOptions) {
  reporter.info('Running orbit ws')
  const appIdentifiers = await watchBuildWorkspace(options)

  let orbitDesktop = await getOrbitDesktop()

  if (!orbitDesktop) {
    process.exit(0)
  }

  try {
    reporter.info('Sending open workspace command')
    await orbitDesktop.command(AppOpenWorkspaceCommand, {
      path: options.workspaceRoot,
      appIdentifiers,
    })
  } catch (err) {
    console.log('Error opening app for dev', err.message, err.stack)
    return
  }

  return
}

async function watchBuildWorkspace(options: CommandWSOptions) {
  reporter.info(`Running command ws in mode ${options.mode}`)

  const directory = options.workspaceRoot
  const { appsInfo, appsRootDir } = await getAppsInfo(directory)
  if (!appsInfo || !appsInfo.length) {
    console.log('No apps found')
    return []
  }

  const dllFile = join(__dirname, 'manifest.json')

  const appEntries = []
  for (const { id } of appsInfo) {
    appEntries.push(id)
  }

  const appsConf: WebpackParams = {
    name: 'apps',
    watch: false,
    mode: options.mode,
    entry: appEntries,
    context: appsRootDir,
    target: 'web',
    publicPath: '/',
    outputFile: '[name].apps.js',
    output: {
      library: 'apps',
    },
    dll: dllFile,
  }
  // we have to build apps once
  if (options.clean || !(await pathExists(dllFile))) {
    console.log('building apps DLL once...')
    await webpackPromise([getAppConfig(appsConf)])
  }

  // create app config now with `hot`
  const appsConfig = getAppConfig({
    ...appsConf,
    watch: true,
    hot: true,
  })

  let entry = ''
  let extraConfig
  const isInMonoRepo = await getIsInMonorepo()
  if (isInMonoRepo) {
    // main entry for orbit-app
    const monoRoot = join(__dirname, '..', '..', '..')
    const appEntry = join(monoRoot, 'app', 'orbit-app', 'src', 'main')
    entry = appEntry
    const extraConfFile = join(appEntry, '..', '..', 'webpack.config.js')
    if (await pathExists(extraConfFile)) {
      extraConfig = require(extraConfFile)
    }
  }

  await writeFile(
    join(entry, '..', '..', 'appDefinitions.js'),
    `
    // all apps
    ${appsInfo
      .map(app => {
        return `export const ${app.id.replace(/[^a-zA-Z]/g, '')} = require('${app.id}')`
      })
      .join('\n')}
  `,
  )

  let extraEntries = {}
  let extraMainConfig = null

  if (extraConfig) {
    const { main, ...others } = extraConfig
    extraMainConfig = main
    for (const name in others) {
      extraEntries[name] = await makeWebpackConfig(
        {
          mode: options.mode,
          name,
          outputFile: `${name}.js`,
          context: options.workspaceRoot,
          target: 'web',
          hot: true,
        },
        extraConfig[name],
      )

      console.log(name, extraEntries[name])
    }
  }

  const wsConfig = await makeWebpackConfig(
    {
      name: 'main',
      context: options.workspaceRoot,
      entry: [entry],
      target: 'web',
      watch: true,
      hot: true,
      dllReference: dllFile,
    },
    extraMainConfig,
  )

  const server = new BuildServer({
    main: wsConfig,
    apps: appsConfig,
    ...extraEntries,
  })

  await server.start()

  return appsInfo.map(x => x.id)
}

async function getAppsInfo(spaceDirectory: string) {
  reporter.info(`read space spaceDirectory ${spaceDirectory}`)
  const pkg = await readJSON(join(spaceDirectory, 'package.json'))
  if (!pkg) {
    reporter.log('No package found!')
    return null
  }
  const packages = pkg.dependencies
  if (!packages) {
    reporter.log('No app definitions in package.json')
    return null
  }

  reporter.info(`found apps ${Object.keys(packages).join(', ')}`)
  let appsRootDir = ''

  const appsInfo = await Promise.all(
    Object.keys(packages).map(async id => {
      const directory = await findNodeModuleDir(spaceDirectory, id)
      if (directory) {
        appsRootDir = directory // can be last one
        const appPkg = await readJSON(join(directory, 'package.json'))
        const entry = appPkg.main
        return {
          id,
          directory,
          entry: join(directory, entry),
        }
      }
    }),
  )

  return {
    appsRootDir,
    appsInfo: appsInfo.filter(Boolean),
  }
}

async function findNodeModuleDir(startDir: string, packageName: string) {
  let modulesDir = join(startDir, 'node_modules')
  // find parent node_modules
  while (modulesDir !== '/') {
    modulesDir = join(modulesDir, '..', '..', 'node_modules')
    const moduleDir = join(modulesDir, ...packageName.split('/'))
    if (await pathExists(moduleDir)) {
      return moduleDir
    }
  }
  return null
}
