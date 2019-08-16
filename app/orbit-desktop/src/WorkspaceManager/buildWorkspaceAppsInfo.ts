import { getWorkspaceApps } from '@o/apps-manager'
import { Logger } from '@o/logger'

import { buildAppInfo } from './buildAppInfo'

const log = new Logger('buildWorkspaceAppsInfo')

export async function buildWorkspaceAppsInfo(
  workspaceRoot: string,
  { watch = false }: { watch?: boolean } = {},
) {
  const paths = await getWorkspaceApps(workspaceRoot)
  log.info(`building app info`, paths)
  await Promise.all(
    paths.map(path => {
      return buildAppInfo({
        projectRoot: path.directory,
        watch,
      })
    }),
  )
}
