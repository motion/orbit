import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppOpenWindowCommand } from '@o/models'
import { Electron } from '@o/stores'

import { forkAndStartOrbitApp } from '../helpers/forkAndStartOrbitApp'

const log = new Logger('AppOpenWindowResolver')

export const AppOpenWindowResolver = resolveCommand(
  AppOpenWindowCommand,
  async ({ appId, isEditing }) => {
    log.info('got open window command, opening...', appId)
    const windowId = Object.keys(Electron.state.appWindows).length
    Electron.setState({
      appWindows: {
        [windowId]: {
          appRole: isEditing ? 'editing' : 'torn',
          windowId,
          appId,
        },
      },
    })

    // setTimeout so command doesnt take forever to run
    setTimeout(() => {
      forkAndStartOrbitApp(
        { windowId },
        {
          WAIT_FOR_ORBIT: 'false',
        },
      )
    })

    return {
      type: 'success',
      message: `Opened new window for ${appId}`,
      value: { windowId },
    } as const
  },
)
