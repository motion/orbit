import { Logger } from '@o/logger'
import { AppMeta, CommandWsOptions } from '@o/models'
import { ensureDir, ensureSymlink, pathExists, readJSON, writeFile } from 'fs-extra'
import { join } from 'path'
import webpack from 'webpack'

import { getIsInMonorepo } from './getIsInMonorepo'
import { DLLReferenceDesc, makeWebpackConfig, WebpackParams } from './makeWebpackConfig'
import { webpackPromise } from './webpackPromise'

const log = new Logger('getAppsConfig')

export const cleanString = (x: string) =>
  x
    .replace(/[^a-z0-9_]/gi, '_')
    .replace(/-{2,}/g, '_')
    .replace(/^[^a-z]/i, '')
    .replace(/[^a-z]$/i, '')

/**
 * This returns the configuration object for everything:
 *   1. a base.dll.js that includes the big shared libraries
 *   2. each app as it's own dll
 *   3. the "main" entry point with orbit-app
 */

export async function getAppsConfig(directory: string, apps: AppMeta[], options: CommandWsOptions) {
  if (!apps.length) {
    return null
  }

  // watch mode by default (if not building)
  const watch = !options.build

  log.info(`mode ${options.mode} watch ${watch} ${directory}, apps ${apps.length}`, options)

  const isInMonoRepo = await getIsInMonorepo()

  // link local apps into local node_modules
  await ensureDir(join(directory, 'node_modules'))
  await Promise.all(
    apps
      .filter(x => x.isLocal)
      .map(async app => {
        const where = join(
          directory,
          // FOR NOW lets link into monorepo root if need be
          // need to figure out how to control dlls a bit better
          ...(isInMonoRepo ? ['..', '..'] : []),
          'node_modules',
          ...app.packageId.split('/'),
        )
        log.info(`Ensuring symlink from ${app.directory} to ${where}`)
        await ensureSymlink(app.directory, where)
      }),
  )

  const outputDir = join(directory, 'dist')
  let dllReferences: DLLReferenceDesc[] = []

  /**
   * Webpack fails to handle DLLs properly on first build, you can't put them all into
   * one config. You need to build them once before running the dllReference (main) app.
   * This inline function just ensures we build + reference them.
   */
  async function addDLL(params: WebpackParams): Promise<webpack.Configuration> {
    // add to dlls
    dllReferences.unshift({
      manifest: params.dll,
      filepath: join(params.outputDir || outputDir, params.outputFile),
    })
    // ensure built
    if (options.clean || !(await pathExists(params.dll))) {
      log.info(`Ensuring config built once: ${params.name}...`)
      const buildOnceConfig = await makeWebpackConfig({
        ...params,
        hot: watch,
        watch: false,
      })
      await webpackPromise([buildOnceConfig], { loud: true })
    }
    return await makeWebpackConfig({
      ...params,
      hot: watch,
      watch,
    })
  }

  const basePackages = [
    '@o/kit',
    '@o/ui',
    '@o/utils',
    '@o/bridge',
    '@o/logger',
    '@o/config',
    '@o/models',
    '@o/stores',
    '@o/libs',
    '@o/css',
    '@o/color',
    '@o/automagical',
    '@o/use-store',
    'webpack-hot-middleware',
  ]

  // gather all packages we want included in base dll
  // i had to add this at one point because webpack stopped providing
  // the sub-packages of @o/ui and @o/kit, not sure why that happened
  let allPackages = [...basePackages]
  for (const pkg of basePackages) {
    const path = require.resolve(`${pkg}/package.json`)
    const pkgJson = await readJSON(path)
    const deps = [
      ...Object.keys(pkgJson.dependencies || {}),
      ...Object.keys(pkgJson.peerDependencies || {}),
    ]
    allPackages = [...allPackages, ...deps]
  }
  // ignore electron things
  // TODO make this a bit more... viable
  allPackages = allPackages.filter(
    x =>
      x !== 'electron-log' &&
      x !== 'configstore' &&
      x !== 'react-use' &&
      x !== '@babel/runtime' &&
      x !== 'typeorm',
  )

  // base dll with shared libraries
  const baseDllManifest = join(outputDir, 'manifest-base.json')
  const baseDllOutputFileName = 'base.dll.js'
  const baseConfig = await addDLL({
    name: `base`,
    injectHot: true,
    entry: [...new Set(allPackages)],
    ignore: ['electron-log', 'configstore', 'typeorm'],
    context: directory,
    mode: options.mode,
    target: 'web',
    publicPath: '/',
    outputFile: baseDllOutputFileName,
    outputDir,
    output: {
      library: 'base',
    },
    dll: baseDllManifest,
  })

  // apps dlls with just each apps code
  const appParams: WebpackParams[] = await Promise.all(
    apps.map(async app => {
      const cleanName = cleanString(app.packageId)
      const dllFile = join(outputDir, `manifest-${cleanName}.json`)
      const appEntry = join(
        app.directory,
        (await readJSON(join(app.directory, 'package.json'))).main,
      )
      const params: WebpackParams = {
        name: `app_${cleanName}`,
        entry: [appEntry],
        context: directory,
        mode: options.mode,
        target: 'web',
        publicPath: '/',
        outputFile: `${cleanName}.dll.js`,
        outputDir,
        injectHot:
          app.packageId === '@o/demo-app-api-grid' ||
          app.packageId === '@o/lists-app' ||
          app.packageId === '@o/people-app' ||
          app.packageId === '@o/demo-app-layout' ||
          app.packageId === '@o/demo-app-flow',
        output: {
          library: cleanName,
        },
        dll: dllFile,
        // apps use the base dll
        dllReferences: [
          {
            manifest: baseDllManifest,
            filepath: join(outputDir, baseDllOutputFileName),
          },
        ],
      }
      return params
    }),
  )
  const appsConfigs = {}
  await Promise.all([
    appParams.map(async params => {
      const config = await addDLL(getAppParams(params))
      appsConfigs[params.name] = config
    }),
  ])

  /**
   * Only needed when developing orbit itself.
   * Get the monorepo in development mode and build orbit
   */
  let entry = ''
  let extraConfig
  if (isInMonoRepo) {
    // main entry for orbit-app
    const monoRoot = join(__dirname, '..', '..', '..', '..')
    const appEntry = join(monoRoot, 'app', 'orbit-app', 'src', 'main')
    entry = appEntry
    const extraConfFile = join(appEntry, '..', '..', 'webpack.config.js')
    if (await pathExists(extraConfFile)) {
      extraConfig = require(extraConfFile)
    }
  }

  /**
   * Allows for our orbit app to define some extra configuration
   * Could be used similarly in the future, if wanted, for apps too.
   */
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
          outputDir,
          context: directory,
          ignore: ['electron-log', 'configstore'],
          target: 'web',
          hot: watch,
          watch,
        },
        extraConfig[name],
      )
      log.info(`extra entry: ${name}`)
    }
  }

  /**
   * Create the apps import
   */
  const appDefinitionsSrc = `// all apps
export default {
  ${apps.map(app => `${cleanString(app.packageId)}: require('${app.packageId}')`).join(',\n')}
}`
  // const appDefsFile = join(entry, '..', '..', 'appDefinitions.js')
  const workspaceEntry = join(directory, 'dist', 'workspace-entry.js')
  log.info(`workspaceEntry ${workspaceEntry}`)
  await writeFile(workspaceEntry, appDefinitionsSrc)

  /**
   * Workspace config, this hopefully gives us some more control/ease with managing hmr/apps
   */
  const workspaceConfig = await makeWebpackConfig({
    name: 'workspaceEntry',
    outputFile: 'workspaceEntry.js',
    outputDir,
    mode: options.mode,
    context: directory,
    entry: [workspaceEntry],
    target: 'web',
    watch,
    hot: watch,
    dllReferences,
    output: {
      library: `window['__orbit_workspace']`,
      libraryTarget: 'assign',
      libraryExport: 'default',
    },
  })

  /**
   * Create index.html
   */
  const indexFile = join(directory, 'dist', 'index.html')
  await writeFile(
    indexFile,
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <script>
      console.time('splash')
    </script>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" type="image/png" href="./favicon.png" />
    <title>Orbit</title>
    <script>
      if (typeof require !== 'undefined') {
        window.electronRequire = require
      } else {
        window.notInElectron = true
        window.electronRequire = module => {
          return {}
        }
      }
    </script>
  </head>

  <body>
    <div id="app"></div>
    <script>
      if (window.notInElectron) {
        // easier to see what would be transparent in dev mode in browser
        document.body.style.background = '#eee'
      }
    </script>
    <script src="/base.dll.js"></script>
    ${apps
      .map(app => {
        return `    <script src="/${cleanString(app.packageId)}.dll.js"></script>`
      })
      .join('\n')}
    <script src="/workspaceEntry.js"></script>
    <script src="/main.js"></script>
  </body>
</html>`,
  )

  /**
   * Load all apps now as one export
   */
  const mainConfig = await makeWebpackConfig(
    {
      name: 'main',
      outputFile: 'main.js',
      outputDir,
      mode: options.mode,
      context: directory,
      entry: [entry],
      ignore: ['electron-log', 'configstore', '@o/worker-kit'],
      target: 'web',
      watch,
      hot: watch,
      dllReferences,
    },
    extraMainConfig,
  )

  return {
    base: baseConfig,
    main: mainConfig,
    workspace: workspaceConfig,
    ...appsConfigs,
    ...extraEntries,
  }
}

export function getAppParams(props: WebpackParams): WebpackParams {
  if (!props.entry.length) {
    log.info(`No entries for ${props.name}`)
    return null
  }
  return {
    mode: 'development',
    publicPath: '/',
    externals: {
      typeorm: 'typeorm',
    },
    ignore: ['electron-log', '@o/worker-kit', 'configstore'],
    ...props,
    output: {
      library: '[name]',
      libraryTarget: 'umd',
      ...props.output,
    },
  }
}
