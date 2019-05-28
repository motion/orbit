import commandExists from 'command-exists'
import exec from 'execa'

import { commandBuild } from './command-build'
import { reporter } from './reporter'

type CommandPublishOptions = { projectRoot: string }

export async function commandPublish(options: CommandPublishOptions) {
  // wont build it already built
  await commandBuild(options)
  await publishApp(options)
  reporter.info(`Published app`)
}

async function publishApp(options: CommandPublishOptions) {
  console.log('publish to verdaccio', options)
  await npmCommand(`publish --registry http://example.com`)
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
