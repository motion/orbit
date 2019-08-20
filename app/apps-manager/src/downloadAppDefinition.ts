import { yarnOrNpm } from '@o/libs-node'
import { Logger } from '@o/logger'
import { StatusReply } from '@o/models'
import execa from 'execa'
import { ensureDir, pathExists, writeJSON } from 'fs-extra'
import { join } from 'path'

import { findPackage } from './findPackage'
import { getAppInfo } from './getAppInfo'

const log = new Logger('downloadAppDefinition')

export async function downloadAppDefinition(options: {
  directory: string
  packageId: string
}): Promise<StatusReply<{ identifier: string }>> {
  const { directory, packageId } = options

  if (!directory || !packageId) {
    return {
      type: 'error',
      message: `No directory/packageId given`,
    } as const
  }

  // if exists already just return it
  const existing = await findPackage(options)
  if (existing) {
    const info = await getAppInfo(existing)
    if (info) {
      return {
        type: 'success',
        message: 'Success',
        value: {
          identifier: info.id,
        },
      } as const
    }
  }

  await ensureDir(directory)

  const packageJsonPath = join(directory, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    await writeJSON(packageJsonPath, {
      name: '@o/app-definitions',
      version: '0.0.0',
      description: 'im just used to make yarn happy',
    })
  }

  try {
    const command = await yarnOrNpm()
    const addMethod = command === 'yarn' ? 'add' : 'install'
    const args = `${addMethod} ${packageId}@latest --registry https://registry.tryorbit.com`.split(
      ' ',
    )

    log.info(`executing ${command} ${args.join(' ')} in ${directory}`)

    const proc = execa(command, args, {
      cwd: directory,
    })

    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)

    await proc

    // get app definition
    console.log('got app, need to provide app definition')

    const loadedDef = await getAppInfo(directory)
    if (!loadedDef) {
      return {
        type: 'error',
        message: `Oh no...`,
      }
    }

    return {
      type: 'success',
      message: 'Success',
      value: {
        identifier: loadedDef.id,
      },
    } as const
  } catch (err) {
    console.log('npm install error', err.message, err.stack)
    return {
      type: 'error',
      message: `${err.message}`,
    } as const
  }
}
