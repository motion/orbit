import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { ChangeDesktopThemeCommand } from '@o/models'
import { Desktop } from '@o/stores'

const log = new Logger('command:change-desktop-theme')

export const ChangeDesktopThemeResolver = resolveCommand(
  ChangeDesktopThemeCommand,
  async ({ theme }) => {
    log.info(`changing desktop theme`, { theme })

    Desktop.setState({
      operatingSystem: {
        theme,
      },
    })
  },
)
