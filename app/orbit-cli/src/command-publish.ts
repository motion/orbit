import 'isomorphic-fetch'

import commandExists from 'command-exists'
import exec from 'execa'
import { readJSON } from 'fs-extra'
import { join } from 'path'

import { commandBuild } from './command-build'
import { reporter } from './reporter'

type CommandPublishOptions = { projectRoot: string }

const registryUrl = `https://registry.tryorbit.com`
const apiUrl = `http://localhost:5000/orbit-3b7f1/us-central1/search`

export async function commandPublish(options: CommandPublishOptions) {
  try {
    // wont build it already built
    await commandBuild(options)

    // publish to registry
    const pkg = await readJSON(join(options.projectRoot, 'package.json'))
    const packageId = pkg.name
    const verion = pkg.version
    const registryInfo = await fetch(`${registryUrl}/${packageId}`).then(x => x.json())
    if (registryInfo.versions[verion]) {
      reporter.info('Already published this version')
    } else {
      await publishApp()
    }

    const buildInfo = await readJSON(join(options.projectRoot, 'dist', 'buildInfo.json'))

    // trigger search api index update
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
