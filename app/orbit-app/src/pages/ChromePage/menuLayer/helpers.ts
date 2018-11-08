import { App } from '@mcro/stores'

export const getOpenMenuID = () => {
  const menuState = App.state.trayState.menuState
  for (const key in menuState) {
    if (menuState[key].open) {
      return menuState[key].id
    }
  }
  return false
}

// will focus or return focus to previous app
export const setTrayFocused = (show = true) => {
  const req = window['electronRequire']
  if (!req) {
    console.log('not in electron')
    return
  }
  if (show) {
    req('electron').remote.app.focus()
  } else {
    req('electron').remote.Menu.sendActionToFirstResponder('hide:')
  }
}
