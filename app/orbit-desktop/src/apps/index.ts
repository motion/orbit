import { AppDesc, AppMiddleware } from '@o/build-server'
import { OrbitAppsManager } from '@o/libs-node'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand } from '@o/mediator'
import { AppBuildCommand, AppDevCloseCommand, AppDevOpenCommand, AppGenTypesCommand, AppStatusMessage, CloseAppCommand } from '@o/models'
import { Electron } from '@o/stores'
import { remove } from 'lodash'

import { GraphServer } from '../GraphServer'
import { commandBuild } from './commandBuild'
import { commandGenTypes } from './commandGenTypes'
import { createCommandWs } from './commandWs'

const log = new Logger('CLI')

export type AppBuildStatusListener = (status: AppStatusMessage) => any

export class Apps {
  developingApps: AppDesc[] = []
  statusListeners = new Set<AppBuildStatusListener>()

  graphServer = new GraphServer()
  appMiddleware = new AppMiddleware()

  constructor(private mediatorServer: MediatorServer, private orbitAppsManager: OrbitAppsManager) {}

  async start() {
    await this.orbitAppsManager.start()
    await this.graphServer.start()
  }

  onStatus(callback: AppBuildStatusListener) {
    this.statusListeners.add(callback)
    return () => {
      this.statusListeners.delete(callback)
    }
  }

  getResolvers() {
    return [
      createCommandWs(this.orbitAppsManager),
      resolveCommand(AppBuildCommand, commandBuild),
      resolveCommand(AppGenTypesCommand, commandGenTypes),
      resolveCommand(AppDevOpenCommand, async ({ path, entry }) => {
        const appId = Object.keys(Electron.state.appWindows).length

        // launch new app
        Electron.setState({
          appWindows: {
            ...Electron.state.appWindows,
            [appId]: {
              appId,
              appRole: 'editing',
            },
          },
        })

        this.developingApps.push({
          entry,
          appId,
          path,
          publicPath: `/appServer/${appId}`,
        })
        this.appMiddleware.setApps(this.developingApps)
        return appId
      }),
      resolveCommand(AppDevCloseCommand, async ({ appId }) => {
        log.info('Removing build server', appId)
        this.developingApps = remove(this.developingApps, x => x.appId === appId)
        this.appMiddleware.setApps(this.developingApps)
        log.info('Removing process', appId)
        await this.mediatorServer.sendRemoteCommand(CloseAppCommand, { appId })
        log.info('Closed app', appId)
      }),
    ]
  }

  private sendStatus(message: Pick<AppStatusMessage, 'type' | 'message' | 'appId'>) {
    ;[...this.statusListeners].forEach(listener => {
      listener({
        id: `${message.appId}-build-status`,
        ...message,
      })
    })
  }
}
