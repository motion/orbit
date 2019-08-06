import { resolveCommand } from '@o/mediator'
import { AppOpenWindowCommand } from '@o/models'
import { Electron } from '@o/stores'

import { forkAndStartOrbitApp } from '../helpers/forkAndStartOrbitApp'

export const AppOpenWindowResolver = resolveCommand(
  AppOpenWindowCommand,
  async ({ appId, isEditing }) => {
    console.log('got open window command, opening...', appId)
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
      value: windowId,
    }
  },
)
