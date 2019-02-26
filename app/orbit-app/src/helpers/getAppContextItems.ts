import { remove } from '@mcro/bridge'
import { showConfirmDialog } from '@mcro/kit'
import { AppBit, AppModel } from '@mcro/models'

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
          // TODO @umed type off
          remove(AppModel, app as any)
        }
      },
    },
  ]
}
