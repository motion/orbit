import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { ResetDataCommand } from '@o/models'
import root from 'global'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'

const log = new Logger('command:reset-data')

export const ResetDataResolver = resolveCommand(ResetDataCommand, async () => {
  log.info(`resetting data...`)
  await (root.Root as OrbitDesktopRoot).databaseManager.resetAllData()
})
