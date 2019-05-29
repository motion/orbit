import 'isomorphic-fetch'

import { AppDefinition } from '@o/models'
import commandExists from 'command-exists'
import exec from 'execa'
import { pathExists, readFile, readJSON } from 'fs-extra'
import { join } from 'path'
import prompts from 'prompts'

import { commandBuild } from './command-build'
import { reporter } from './reporter'

type CommandPublishOptions = {
  projectRoot: string
  force?: boolean
}

const isDev = process.env.NODE_ENV === 'development'

const registryUrl = isDev ? `http://example.com` : `https://registry.tryorbit.com`
const apiUrl = isDev
  ? `http://localhost:5000/orbit-3b7f1/us-central1/search`
  : `https://tryorbit.com/api`

export function invariant(condition: boolean, message: string) {
  if (!condition) {
    reporter.error(message)
    throw new Error(message)
  }
}

export async function commandPublish(options: CommandPublishOptions) {
  try {
    // wont build it already built
    await commandBuild({
      projectRoot: options.projectRoot,
      force: options.force,
    })

    // publish to registry
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    const packageId = pkg.name
    const verion = pkg.version
    const registryInfo = await fetch(`${registryUrl}/${packageId}`).then(x => x.json())
    let shouldPublish = true

    // run before publish so if there's any error we can validate before publishing
    let app: AppDefinition
    try {
      app = require(join(options.projectRoot, 'dist', 'appInfo.js')).default
      console.log('appInfo', app)
    } catch (err) {
      reporter.error(`appInfo.js didn't build, there was some error building your app`)
      return
    }

    invariant(typeof app.id === 'string', `Must set appInfo.id, got: ${app.id}`)
    invariant(typeof app.icon === 'string', `Must set appInfo.icon, got: ${app.icon}`)
    invariant(typeof app.name === 'string', `Must set appInfo.name, got: ${app.name}`)

    if (registryInfo.versions && registryInfo.versions[verion]) {
      shouldPublish = false
      reporter.info('Already published this version')
      const { value: shouldUpdateVersion } = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'This version already published, would you like to update to a new version?',
        initial: true,
      })

      if (shouldUpdateVersion) {
        const { value: bumpType } = await prompts({
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

        if (bumpType) {
          reporter.info(`Bumping version ${bumpType}`)
          const runner = await yarnOrNpm()
          await npmCommand(
            runner === 'npm' ? `version ${bumpType}` : `version --new-version ${bumpType}`,
          )
          shouldPublish = true
        }
      }
    }

    if (shouldPublish) {
      reporter.info(`Publishing app to registry`)
      await publishApp()
    }

    // trigger search api index update
    reporter.info(`Indexing new app information for search`)

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
          x => x === 'graph' || x === 'app' || x === 'api' || x === 'sync',
        ),
        fullDescription,
      }),
    }).then(x => x.json())

    reporter.success(`Published app`)
  } catch (err) {
    reporter.error(err.message, err)
  }
}

async function publishApp() {
  return await npmCommand(`publish --registry ${registryUrl}`)
}

async function npmCommand(args: string) {
  const cmd = await yarnOrNpm()
  await exec(cmd, args.split(' '))
}

async function yarnOrNpm() {
  const hasYarn = await commandExists('yarn')
  const hasNpm = await commandExists('npm')
  if (!hasYarn && !hasNpm) {
    throw new Error(`Neither npm or yarn installed, need one of them to continue.`)
  }
  return hasYarn ? 'yarn' : 'npm'
}
