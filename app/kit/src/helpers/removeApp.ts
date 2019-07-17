import { command } from '@o/bridge'
import { AppBit, AppRemoveCommand } from '@o/models'
import { BannerHandle } from '@o/ui'

import { showConfirmDialog } from './showConfirmDialog'

export const removeApp = async (app: AppBit, banner: BannerHandle) => {
  if (!app.id) {
    throw new Error(`No app id`)
  }
  if (
    showConfirmDialog({
      title: 'Remove app?',
      message: `Are you sure you want to remove ${app.name}?`,
    })
  ) {
    banner.set({
      message: `Removing app ${app.name}`,
    })
    await command(AppRemoveCommand, {
      appId: app.id,
    })
    banner.set({
      message: `Removed ${app.name}`,
      type: 'success',
      timeout: 1800,
    })
  }
}
