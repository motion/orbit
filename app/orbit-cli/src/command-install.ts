import { reporter } from './reporter'

export async function commandInstall(options: {
  workspace: string
  identifier: string
  verbose: boolean
}) {
  reporter.info(`Installing ${options.identifier} into ${options.workspace}`)
  return
}
