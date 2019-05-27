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
}
