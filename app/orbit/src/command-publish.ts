import 'isomorphic-fetch'

import { npmCommand, yarnOrNpm } from '@o/libs-node'
import { AppDefinition } from '@o/models'
import { pathExists, readFile, readJSON } from 'fs-extra'
import { join } from 'path'
import prompts from 'prompts'

import { commandBuild } from './command-build'
import { reporter } from './reporter'

export type CommandPublishOptions = {
  projectRoot: string
  ignoreBuild?: boolean
  ignoreVersion?: boolean
  bumpVersion?: 'patch' | 'minor' | 'major'
}

// const isDev = process.env.NODE_ENV === 'development'

export const registryUrl = false ? `http://example.com` : `https://registry.tryorbit.com`

export const apiUrl = false
  ? `http://localhost:5000/orbit-3b7f1/us-central1/search`
  : `https://tryorbit.com/api`

export function invariant(condition: boolean, message: string) {
  if (!condition) {
    reporter.error(message)
    throw new Error(message)
  }
}

const bumpVersions = {
  patch: 'patch',
  minor: 'minor',
  major: 'major',
}

export const getRegistryInfo = (packageId: string) =>
  fetch(`${registryUrl}/${packageId}`).then(x => x.json())

export const getRegistryLatestVersion = async (packageId: string) => {
  const info = await getRegistryInfo(packageId)
  return `${info['dist-tags'].latest}`
}

export async function commandPublish(options: CommandPublishOptions) {
  try {
    // wont build it already built
    if (!options.ignoreBuild) {
      await commandBuild(
        {
          projectRoot: options.projectRoot,
          force: true,
        },
        false,
      )
    }

    // publish to registry
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    const packageId = pkg.name
    const version = pkg.version

    let shouldPublish = true
    let bumpVersion = bumpVersions[options.bumpVersion]

    // run before publish so if there's any error we can validate before publishing
    let app: AppDefinition
    try {
      app = require(join(options.projectRoot, 'dist', 'appInfo.js')).default
    } catch (err) {
      reporter.panic(
        `appInfo.js didn't build, there was some error building your app. Did you export default createApp({ ... })?`,
      )
      return
    }

    invariant(typeof app.id === 'string', `Must set appInfo.id, got: ${app.id}`)
    invariant(typeof app.icon === 'string', `Must set appInfo.icon, got: ${app.icon}`)
    invariant(typeof app.name === 'string', `Must set appInfo.name, got: ${app.name}`)

    if (options.ignoreVersion) {
      shouldPublish = true
    }

    const registryInfo = await getRegistryInfo(packageId)

    // if should prompt for version update
    if (
      !bumpVersion &&
      registryInfo.versions &&
      registryInfo.versions[version] &&
      !options.ignoreVersion
    ) {
      shouldPublish = false
      reporter.info('Already published this version')
      const { value: shouldUpdateVersion } = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'This version already published, would you like to update to a new version?',
        initial: false,
      })

      if (shouldUpdateVersion) {
        const { value } = await prompts({
          type: 'select',
          name: 'value',
          message: 'Which version type would you like to bump to?',
          choices: [
            { title: 'Patch', value: 'patch' },
            { title: 'Minor', value: 'minor' },
            { title: 'Major', value: 'major' },
          ],
          initial: 0,
        })
        if (value) {
          bumpVersion = value
          shouldPublish = true
        }
      }
    }

    if (bumpVersion) {
      reporter.info(`Bumping version ${bumpVersion}`)
      const runner = await yarnOrNpm()
      await npmCommand(
        runner === 'npm'
          ? `version ${bumpVersion}`
          : `version --new-version ${bumpVersion} --no-git-tag-version`,
      )
    }

    if (shouldPublish) {
      // npm first so if it fails we dont udpate search
      reporter.info(`Publishing to npm...`)
      let err = await publishApp(`https://registry.npmjs.org`)
      if (err) {
        reporter.error(err.message, err.error)
        return err
      }
      reporter.info(`Publishing to Orbit registry...`)
      err = await publishApp()
      if (err) {
        reporter.error(err.message, err.error)
        return err
      }
    }

    // trigger search api index update
    reporter.info(`Publishing to Orbit store...`)

    // get README.md description
    let fullDescription = pkg.description
    const readmePath = join(options.projectRoot, 'README.md')
    if (await pathExists(readmePath)) {
      fullDescription = await readFile(readmePath)
    }

    await fetch(`${apiUrl}/searchUpdate`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId,
        identifier: app.id,
        name: app.name,
        icon: app.icon,
        features: Object.keys(app).filter(
          x =>
            x === 'graph' ||
            x === 'app' ||
            x === 'api' ||
            x === 'sync' ||
            x === 'workers' ||
            x === 'auth',
        ),
        fullDescription,
        setup: app.setup,
        author: pkg.author || 'anonymous',
      }),
    }).then(x => x.json())

    reporter.success(`Published app`)
  } catch (err) {
    reporter.error(err.message, err)
  }

  process.exit(0)
}

async function publishApp(registry?: string) {
  try {
    // TODO access control via CLI
    await npmCommand(`publish --registry ${registry || registryUrl} --access public`)
  } catch (err) {
    return {
      type: 'error' as const,
      message: `${err.message}`,
      error: err,
    }
  }
}
