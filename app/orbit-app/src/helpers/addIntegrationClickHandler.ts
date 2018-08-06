import { App } from '@mcro/stores'

type IntegrationItem = {
  auth: boolean
  id: string
  title: string
}

export const addIntegrationClickHandler = (item: IntegrationItem) => ({
  currentTarget,
}) => {
  if (item.auth) {
    App.actions.toggleSelectItem(
      { id: item.id, type: 'view', title: item.title },
      currentTarget,
    )
  } else {
    App.actions.openAuth(item.id)
  }
}
