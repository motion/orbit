import 'isomorphic-fetch'

import commandExists from 'command-exists'
import exec from 'execa'
import { readJSON } from 'fs-extra'
import { join } from 'path'
import prompts from 'prompts'

import { commandBuild } from './command-build'
import { reporter } from './reporter'

type CommandPublishOptions = { projectRoot: string }

const registryUrl =
  process.env.NODE_ENV === 'development' ? `http://example.com` : `https://registry.tryorbit.com`
const apiUrl =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:5000/orbit-3b7f1/us-central1/search`
    : `https://api.tryorbit.com`

export async function commandPublish(options: CommandPublishOptions) {
  try {
    // wont build it already built
    await commandBuild(options)

    // publish to registry
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    const packageId = pkg.name
    const verion = pkg.version
    const registryInfo = await fetch(`${registryUrl}/${packageId}`).then(x => x.json())
    let shouldPublish = true

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
      await publishApp()
    }

    const buildInfo = await readJSON(join(options.projectRoot, 'dist', 'buildInfo.json'))

    // trigger search api index update
    reporter.info(`Indexing new app information for search`)
    await fetch(`${apiUrl}/index`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId,
        identifier: buildInfo.identifier,
      }),
    }).then(x => x.json())

    reporter.info(`Published app`)
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
