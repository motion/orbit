import { Logger } from '@mcro/logger'
import { Desktop } from '@mcro/stores'
import macosVersion from 'macos-version'

const log = new Logger('OperatingSystemManager')

export class OperatingSystemManager {
  start() {
    log.info('Start')

    Desktop.setState({
      operatingSystem: {
        macVersion: macosVersion(),
      },
    })

    Desktop.onMessage(Desktop.messages.OS_THEME, theme => {
      Desktop.setState({
        operatingSystem: {
          theme,
        },
      })
    })
  }
}
