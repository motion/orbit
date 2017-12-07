const electron = (window.require && window.require('electron')) || {}

export const OS = (electron && electron.ipcRenderer) || {
  send() {
    // console.log('Avoid OS.send, not in electron')
  },
  on() {
    // console.log('Avoid OS.on, not in electron')
  },
  off() {
    // this avoids hmr errors
  },
}

window.electron = electron

export default electron
