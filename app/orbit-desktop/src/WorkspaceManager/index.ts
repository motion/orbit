import { OrbitAppsManager } from '@o/libs-node'
import { Logger } from '@o/logger'
import { MediatorServer, resolveCommand } from '@o/mediator'
import { AppBuildCommand, AppDevCloseCommand, AppDevOpenCommand, AppGenTypesCommand, AppStatusMessage, CloseAppCommand } from '@o/models'
import { Desktop, Electron } from '@o/stores'
import { remove } from 'lodash'

import { GraphServer } from '../GraphServer'
import { AppDesc, AppMiddleware } from './AppMiddleware'
import { commandBuild, getAppEntry } from './commandBuild'
import { commandGenTypes } from './commandGenTypes'
import { createCommandWs } from './commandWs'
import { getIdentifierToPackageId } from './getPackageId'

const log = new Logger('WorkspaceManager')

export type AppBuildStatusListener = (status: AppStatusMessage) => any

export class WorkspaceManager {
  developingApps: AppDesc[] = []

  graphServer = new GraphServer()
  appMiddleware = new AppMiddleware()

  constructor(private mediatorServer: MediatorServer, private orbitAppsManager: OrbitAppsManager) {
    // signals to frontend to update app definitions
    this.orbitAppsManager.onUpdatedAppMeta(appMeta => {
      log.info('orbitAppsManager updating app meta', appMeta)
      const identifiers = Object.keys(appMeta)
      const packageIds = identifiers.map(getIdentifierToPackageId)
      Desktop.setState({
        workspaceState: {
          packageIds,
          identifiers,
        },
      })
    })
  }

  async start() {
    await this.orbitAppsManager.start()
    await this.graphServer.start()
  }

  getResolvers() {
    return [
      createCommandWs(this.orbitAppsManager),
      resolveCommand(AppBuildCommand, commandBuild),
      resolveCommand(AppGenTypesCommand, commandGenTypes),
      resolveCommand(AppDevOpenCommand, async ({ projectRoot }) => {
        const entry = await getAppEntry(projectRoot)
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
          path: projectRoot,
          publicPath: `/appServer/${appId}`,
        })
        this.appMiddleware.setApps(this.developingApps)
        return {
          type: 'success',
          message: 'Got app id',
          value: `${appId}`,
        } as const
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
}
