import { remove } from '../mediator'
import { App, AppModel } from '@mcro/models'
import { showConfirmDialog } from './electron/showConfirmDialog'

export function getAppContextItems(app: App) {
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
