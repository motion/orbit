import { remove } from '@o/bridge'
import { showConfirmDialog } from '@o/kit'
import { AppBit, AppModel } from '@o/models'

export function getAppContextItems(app: AppBit) {
  return [
    {
      label: 'Remove',
      click() {
        if (
          showConfirmDialog({
            title: 'Are you sure you want to delete this app?',
            message: `Deleting this app will remove it from this space and delete it's data.`,
          })
        ) {
          remove(AppModel, app)
        }
      },
    },
  ]
}
