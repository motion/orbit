import { getWorkspaceApps } from '@o/apps-manager'

import { buildAppInfo } from './buildAppInfo'

export async function buildWorkspaceAppsInfo(
  workspaceRoot: string,
  { watch = false }: { watch?: boolean } = {},
) {
  const paths = await getWorkspaceApps(workspaceRoot)
  await Promise.all(
    paths.map(path => {
      return buildAppInfo({
        projectRoot: path.directory,
        watch,
      })
    }),
  )
}
