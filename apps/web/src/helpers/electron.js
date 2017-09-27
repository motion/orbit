import electron, { ipcRenderer } from 'electron'

export const OS = ipcRenderer || {
  send() {
    console.log('Avoid OS.send, not in electron')
  },
}

export default electron
