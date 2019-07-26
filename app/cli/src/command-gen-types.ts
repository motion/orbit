import { AppGenTypesCommand, CommandGenTypesOptions } from '@o/models'
import { pathExists } from 'fs-extra'
import { join } from 'path'

import { getOrbitDesktop } from './getDesktop'
import { logStatusReply } from './logStatusReply'
import { reporter } from './reporter'

export async function commandGenTypes(options: CommandGenTypesOptions) {
  reporter.info('Running orbit gen-types')
  const apiEntry = join(options.projectEntry, '..', 'api.node.ts')
  if (!(await pathExists(apiEntry))) {
    reporter.log(`No api entry found ${apiEntry}`)
    return
  }
  const { mediator } = await getOrbitDesktop({
    singleUseMode: true,
  })
  logStatusReply(await mediator.command(AppGenTypesCommand, options))
}
