import { reporter } from './reporter'

export type CommandInstallOptions = {
  workspace: string
  identifier: string
  verbose: boolean
}

export async function commandInstall(options: CommandInstallOptions) {
  reporter.info(`Installing ${options.identifier} into ${options.workspace}`)
  return
}
