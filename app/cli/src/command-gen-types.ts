import { AppGenTypesCommand, CommandGenTypesOptions } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'

import { getOrbitDesktop } from './getDesktop'
import { reporter } from './reporter'

export async function commandGenTypes(options: CommandGenTypesOptions) {
  reporter.info('Running orbit gen-types')
  const apiEntry = join(options.projectEntry, '..', 'api.node.ts')

  if (!(await pathExists(apiEntry))) {
    reporter.log(`No api entry found ${apiEntry}`)
    return
  }

  const { mediator } = await getOrbitDesktop()
  if (!mediator) {
    reporter.panic('No mediator found')
  }

  await mediator.command(AppGenTypesCommand, options)
}
