import { resolveCommand } from '@mcro/mediator'
import { Logger } from '@mcro/logger'
import { ChangeDesktopThemeCommand } from '@mcro/models'
import { Desktop } from '@mcro/stores'

const log = new Logger('command:change-desktop-theme')

export const ChangeDesktopThemeResolver = resolveCommand(ChangeDesktopThemeCommand, async ({ theme }) => {
  log.info(`changing desktop theme`, { theme })

  Desktop.setState({
    operatingSystem: {
      theme,
    },
  })
})
