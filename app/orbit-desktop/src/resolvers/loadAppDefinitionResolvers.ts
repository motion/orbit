import { getGlobalConfig, Logger, resolveCommand } from '@o/kit'
import { AppDefinition, AppDefinitionSetupVerifyCommand, GetAppStoreAppDefinitionCommand } from '@o/models'
import commandExists from 'command-exists'
import execa from 'execa'
import { ensureDir, pathExists, writeJSON } from 'fs-extra'
import { join } from 'path'

const log = new Logger('app-store-definition-resolvers')

const Config = getGlobalConfig()
const tempPackageDir = join(Config.paths.userData, 'app_definitions')

export function loadAppDefinitionResolvers() {
  return [resolveGetAppStoreDefinition(), resolveAppSetupVerify()]
}

const identifierToPackageId = {}

function resolveAppSetupVerify() {
  return resolveCommand(AppDefinitionSetupVerifyCommand, async ({ identifier, app }) => {
    const packageId = identifierToPackageId[identifier]
    if (!packageId) {
      return {
        type: 'error',
        message: `No package id found for identifier ${identifier}`,
      }
    }

    const appPath = join(tempPackageDir, 'node_modules', ...packageId.split('/'))
    if (!(await pathExists(appPath))) {
      return {
        type: 'error',
        message: 'No app definition downloaded',
      }
    }

    // run definition
    const loadedDef = await getLoadedAppDefinition(packageId)
    if (loadedDef.type === 'error') {
      return loadedDef
    }

    const res = await loadedDef.definition.setupValidate(app)

    if (typeof res === 'string') {
      return {
        type: 'success',
        message: res,
      }
    }

    if (res === undefined || res === true) {
      return {
        type: 'success',
        message: 'Success',
      }
    }

    return {
      type: 'error',
      errors: res,
    }
  })
}

function resolveGetAppStoreDefinition() {
  return resolveCommand(GetAppStoreAppDefinitionCommand, async ({ packageId }) => {
    await ensureDir(tempPackageDir)
    await writeJSON(join(tempPackageDir, 'package.json'), {
      name: '@o/app-definitions',
      version: '0.0.0',
      description: 'im just used to make yarn happy',
    })
    try {
      const command = await yarnOrNpm()
      const addMethod = command === 'yarn' ? 'add' : 'install'
      const args = `${addMethod} ${packageId}@latest --registry https://registry.tryorbit.com`.split(
        ' ',
      )
      log.info(`executing ${command} ${args.join(' ')} in ${tempPackageDir}`)
      const proc = execa(command, args, {
        cwd: tempPackageDir,
      })

      proc.stdout.pipe(process.stdout)
      proc.stderr.pipe(process.stderr)

      await proc

      // get app definition
      console.log('got app, need to provide app definition')

      const loadedDef = await getLoadedAppDefinition(packageId)

      if (loadedDef.type === 'error') {
        return loadedDef
      }

      return {
        type: 'success',
        identifier: loadedDef.definition.id,
      }
    } catch (err) {
      console.log('npm install error', err.message, err.stack)
      return { type: 'error', message: err.message }
    }
  })
}

async function yarnOrNpm() {
  const hasYarn = await commandExists('yarn')
  const hasNpm = await commandExists('npm')
  if (!hasYarn && !hasNpm) {
    throw new Error(`Neither npm or yarn installed, need one of them to continue.`)
  }
  return hasYarn ? 'yarn' : 'npm'
}

async function getLoadedAppDefinition(packageId: string) {
  const appPath = join(tempPackageDir, 'node_modules', ...packageId.split('/'))
  const appDefPath = join(appPath, 'dist', 'appInfo.js')

  log.info(`Importing app definition at ${appDefPath}`)

  let definition: AppDefinition

  try {
    definition = require(appDefPath).default
    identifierToPackageId[definition.id] = packageId
  } catch (err) {
    console.log('error with app def', err)
    return {
      type: 'error' as const,
      message: err.message,
    }
  }

  log.info(`got def ${definition.name}`)

  return {
    type: 'success' as const,
    definition,
  }
}
