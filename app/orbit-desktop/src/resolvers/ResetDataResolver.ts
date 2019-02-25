import { resolveCommand } from '@mcro/mediator'
import { ResetDataCommand } from '@mcro/models'
import { Logger } from '@mcro/logger'
import root from 'global'
import { OrbitDesktopRoot } from '../OrbitDesktopRoot'

const log = new Logger('command:reset-data')

export const ResetDataResolver = resolveCommand(ResetDataCommand, async () => {
  log.info(`resetting data...`)
  await (root.Root as OrbitDesktopRoot).databaseManager.resetAllData()
})
