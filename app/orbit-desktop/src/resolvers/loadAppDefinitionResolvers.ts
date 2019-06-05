import { commandInstall, getPackageId, requireAppDefinition } from '@o/cli'
import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppDefinitionSetupVerifyCommand, GetAppStoreAppDefinitionCommand, InstallAppToWorkspaceCommand, SpaceEntity, UserEntity } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'
import { getRepository } from 'typeorm'

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
  return resolveCommand(InstallAppToWorkspaceCommand, async ({ identifier }) => {
    const directory = await getWorkspaceDirectory()
    const res = await commandInstall({ identifier, directory })
    if (res.type === 'error') {
      return res
    }
    return {
      type: 'success' as const,
      message: `Installed ${identifier} successfully`,
    }
  })
}

function resolveAppSetupVerify() {
  return resolveCommand(AppDefinitionSetupVerifyCommand, async ({ identifier, app }) => {
    log.info(`Verifying app ${identifier}`)

    const packageId = await getPackageId(identifier)

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
    const loadedDef = await requireAppDefinition(packageId)

    if (loadedDef.type === 'error') {
      return loadedDef
    }

    if (!loadedDef.definition.setupValidate) {
      return {
        type: 'success' as const,
        message: 'Success, no validation defined',
      }
    }

    let res

    try {
      res = await loadedDef.definition.setupValidate(app)
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

function resolveGetAppStoreDefinition() {
  return resolveCommand(GetAppStoreAppDefinitionCommand, async ({ packageId }) => {
    log.info(`Getting definition for packageId ${packageId}`)
    // TODO
    return null
  })
}
