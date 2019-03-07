import { Logger } from '@o/logger'
import { Desktop } from '@o/stores'
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
  }
}
