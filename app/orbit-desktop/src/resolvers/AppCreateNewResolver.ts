import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppCreateNewCommand } from '@o/models'

const log = new Logger('AppCreateNewCommand')

export const AppCreateNewResolver = resolveCommand(
  AppCreateNewCommand,
  async ({ name, template, icon }) => {
    log.info(`Creating new app ${name} ${template}`)

    icon

    return {
      type: 'success' as const,
      message: `Created new app`,
    }
  },
)
