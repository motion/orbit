import execa from 'execa'
import { ensureDir, pathExists, writeJSON } from 'fs-extra'
import { join } from 'path'

import { yarnOrNpm } from '../command-publish'
import { reporter } from '../reporter'
import { requireAppDefinition } from './requireAppDefinition'

export async function downloadAppDefinition(options: { directory: string; packageId: string }) {
  const { directory, packageId } = options

  if (!directory || !packageId) {
    return {
      type: 'error' as const,
      message: `No directory/packageId given`,
    }
  }

  // if exists already just return it
  const existing = await requireAppDefinition({
    ...options,
    types: ['node', 'web'],
  })
  if (existing.type === 'success') {
    return {
      type: 'success' as const,
      identifier: existing.definition.id,
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

    reporter.info(`executing ${command} ${args.join(' ')} in ${directory}`)

    const proc = execa(command, args, {
      cwd: directory,
    })

    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)

    await proc

    // get app definition
    console.log('got app, need to provide app definition')

    const loadedDef = await requireAppDefinition(options)

    if (loadedDef.type === 'error') {
      return loadedDef
    }

    return {
      type: 'success' as const,
      identifier: loadedDef.definition.id,
    }
  } catch (err) {
    console.log('npm install error', err.message, err.stack)
    return {
      type: 'error' as const,
      message: `${err.message}`,
    }
  }
}
