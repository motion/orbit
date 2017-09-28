const electron = (window.require && window.require('electron')) || {}

export const OS = (electron && electron.ipcRenderer) || {
    send() {
      console.log('Avoid OS.send, not in electron')
    },
  }

export default electron
