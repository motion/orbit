import { IS_ELECTRON } from '../../constants'

// will focus or return focus to previous app
export const setTrayFocused = (show = true) => {
  if (!IS_ELECTRON) {
    return
  }
  const req = window['electronRequire']
  if (show) {
    req('electron').remote.app.focus()
  } else {
    req('electron').remote.Menu.sendActionToFirstResponder('hide:')
  }
}
