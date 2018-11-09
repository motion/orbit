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
