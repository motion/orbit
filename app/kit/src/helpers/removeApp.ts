import { command } from '@o/bridge'
import { AppBit, AppRemoveCommand } from '@o/models'

import { showConfirmDialog } from './showConfirmDialog'

export const removeApp = async (app: AppBit) => {
  if (
    showConfirmDialog({
      title: 'Remove app?',
      message: `Are you sure you want to remove ${app.name}?`,
    })
  ) {
    command(AppRemoveCommand, {
      appId: app.id,
    })
  }
}
