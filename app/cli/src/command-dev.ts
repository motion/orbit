import { AppDevCloseCommand, AppDevOpenCommand, AppOpenWindowCommand, CommandDevOptions } from '@o/models'

import { getOrbitDesktop } from './getDesktop'
import { logStatusReply } from './logStatusReply'
import { addProcessDispose } from './processDispose'
import { reporter } from './reporter'

export async function commandDev(options: CommandDevOptions) {
  const { mediator, didStartOrbit } = await getOrbitDesktop()

  if (didStartOrbit) {
    reporter.info(`Starting workspace from command: dev`)
    console.log('TODO re-enable this')
    // const baseWorkspace = await ensureBaseWorkspace()
    // const lastWorkspace = configStore.lastActiveWorkspace.get()
    // const workspaceRoot = (await isInWorkspace(options.projectRoot, lastWorkspace))
    //   ? lastWorkspace
    //   : baseWorkspace
    // reporter.info(`Using workspace: ${workspaceRoot}`)
    // await commandWs({
    //   workspaceRoot,
    //   mode: 'development',
    // })
  }

  try {
    const devOpenReply = await mediator.command(AppDevOpenCommand, options, {
      onMessage: reporter.info,
    })
    if (devOpenReply.type !== 'success') {
      reporter.panic(devOpenReply.message)
      return
    }
    const { appId } = devOpenReply.value
    const openWindowReply = await mediator.command(AppOpenWindowCommand, {
      appId,
      isEditing: true,
    })
    if (openWindowReply.type !== 'success') {
      reporter.panic(openWindowReply.message)
      return
    }
    const { windowId } = openWindowReply.value
    addProcessDispose(async () => {
      logStatusReply(
        await mediator.command(AppDevCloseCommand, {
          appId,
          windowId,
        }),
      )
    })
  } catch (err) {
    reporter.panic(`Error opening app for dev ${err.message}\n${err.stack}`)
  }
}

// async function isInWorkspace(packagePath: string, workspacePath: string): Promise<boolean> {
//   try {
//     const packageInfo = await readJSON(join(packagePath, 'package.json'))
//     const workspaceInfo = await getWorkspaceApps(workspacePath)
//     if (packageInfo && workspaceInfo) {
//       return workspaceInfo.some(x => x.packageId === packageInfo.name)
//     }
//   } catch (err) {
//     reporter.verbose(`Potential err ${err.message}`)
//   }
//   return false
// }

// /**
//  * Copy an empty workspace somewhere so we can use it for developing apps outside a workspace
//  */
// async function ensureBaseWorkspace() {
//   if (await pathExists(baseWorkspaceDir)) {
//     return baseWorkspaceDir
//   }
//   await copy(join(__dirname, '..', 'base-workspace'), baseWorkspaceDir)
//   return baseWorkspaceDir
// }
