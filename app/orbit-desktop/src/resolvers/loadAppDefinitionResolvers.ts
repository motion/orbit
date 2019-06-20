import {
  commandInstall,
  getPackageId,
  requireAppDefinition,
  updateWorkspacePackageIds,
} from '@o/cli'
import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import {
  AppDefinitionSetupVerifyCommand,
  AppInstallToWorkspaceCommand,
  AppStatusId,
  GetAppStoreAppDefinitionCommand,
  SpaceEntity,
  UserEntity,
} from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

import { appStatus } from '../managers/AppStatusManager'
import { getCurrentWorkspace } from './AppOpenWorkspaceResolver'

const log = new Logger('app-store-definition-resolvers')

const Config = getGlobalConfig()
const tempPackageDir = join(Config.paths.userData, 'app_definitions')

export function loadAppDefinitionResolvers() {
  return [resolveGetAppStoreDefinition(), resolveAppSetupVerify(), resolveInstallAppToWorkspace()]
}

async function getActiveSpace() {
  const activeUser = await getRepository(UserEntity).findOne()
  return await getRepository(SpaceEntity).findOne({
    where: {
      id: activeUser.activeSpace,
    },
  })
}

async function getWorkspaceDirectory() {
  return (await getActiveSpace()).directory
}

function resolveInstallAppToWorkspace() {
  return resolveCommand(AppInstallToWorkspaceCommand, async ({ identifier }) => {
    appStatus.info(AppStatusId.install(identifier), `Installing ${identifier}`)

    const directory = await getWorkspaceDirectory()
    const res = await commandInstall({ identifier, directory })
    log.info(`Got response from install command ${JSON.stringify(res)}`)
    if (res.type === 'error') {
      return res
    }
    await updateWorkspacePackageIds(directory)
    return {
      type: 'success' as const,
      message: `Installed ${identifier} successfully`,
    }
  })
}

function resolveAppSetupVerify() {
  return resolveCommand(AppDefinitionSetupVerifyCommand, async ({ identifier, app }) => {
    log.info(`Verifying app ${identifier}`)

    const loadDef = await getAppDefinitionOrDownloadTemporary(identifier)

    if (loadDef.type === 'error') {
      return loadDef
    }

    const { definition } = loadDef

    if (!definition.setupValidate) {
      return {
        type: 'success' as const,
        message: 'Success, no validation defined',
      }
    }

    let res

    try {
      res = await definition.setupValidate(app)
    } catch (err) {
      console.log('error running validate', err)
      return {
        type: 'error' as const,
        errors: `${err}`,
      }
    }

    if (typeof res === 'string') {
      return {
        type: 'success' as const,
        message: res,
      }
    }

    if (res === undefined || res === true) {
      return {
        type: 'success' as const,
        message: 'Success',
      }
    }

    return {
      type: 'error' as const,
      errors: res,
    }
  })
}

async function getAppDefinitionOrDownloadTemporary(identifier: string) {
  const directory = (await getCurrentWorkspace()).directory
  let packageId = await getPackageId(identifier, {
    rescanWorkspacePath: directory,
  })

  // existing definition
  if (packageId) {
    return await requireAppDefinition({
      packageId,
      directory,
      types: ['node', 'web'],
    })
  }

  // donwload temporary
  packageId = await getPackageId(identifier)

  if (!packageId) {
    return {
      type: 'error' as const,
      message: `No package id found for identifier ${identifier}`,
    }
  }

  const appPath = join(tempPackageDir, 'node_modules', ...packageId.split('/'))
  if (!(await pathExists(appPath))) {
    return {
      type: 'error' as const,
      message: 'No app definition downloaded',
    }
  }

  // run definition
  return await requireAppDefinition({ packageId, directory: tempPackageDir })
}

function resolveGetAppStoreDefinition() {
  return resolveCommand(GetAppStoreAppDefinitionCommand, async ({ packageId }) => {
    log.info(`Getting definition for packageId ${packageId}`)
    // TODO
    return null
  })
}
